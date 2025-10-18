from sentinelhub import SHConfig, BBox, CRS, SentinelHubRequest, DataCollection, MimeType
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64

# Configure Sentinel Hub credentials
config = SHConfig()
#config.instance_id = '5e1ff9bc-4b83-41dd-89dc-f3f2b46289ed'
config.sh_client_id = '5e1ff9bc-4b83-41dd-89dc-f3f2b46289ed'
config.sh_client_secret = 'UBPEd5DWFwBeqha9CHHO8TQNrMY3M0oy'

def fetch_sentinel2_image(lat, lon, size=512, save_path=None):
    """
    Fetches a true-color Sentinel-2 image (L2A) for a given lat/lon.
    Returns a numpy array (H,W,3) normalized for display.
    """
    # Wider bounding box (~2 km)
    bbox = BBox(bbox=[lon-0.1, lat-0.1, lon+0.1, lat+0.1], crs=CRS.WGS84)

    request = SentinelHubRequest(
        evalscript="""
        //VERSION=3
        function setup() {
            return { input: ["B04", "B03", "B02"], output: { bands: 3 } };
        }
        function evaluatePixel(sample) {
            return [sample.B04, sample.B03, sample.B02];
        }
        """,
        input_data=[SentinelHubRequest.input_data(
            DataCollection.SENTINEL2_L2A,
            time_interval=('2025-01-01', '2025-10-01')  # Recent date interval
        )],
        responses=[SentinelHubRequest.output_response('default', MimeType.TIFF)],
        bbox=bbox,
        size=(size, size),
        config=config
    )

    data = request.get_data()
    if len(data) == 0:
        print("No image returned, try different location/date")
        return None

    img = np.array(data[0], dtype=np.float32)

    # Normalize to 0-1 for display
    img = img / 3000.0
    img = np.clip(img, 0, 1)

    if save_path:
        plt.imsave(save_path, img)

    return img

def img_to_base64(img_array):
    buf = BytesIO()
    plt.imsave(buf, img_array, format='png')
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

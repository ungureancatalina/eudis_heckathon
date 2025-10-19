import os
from sentinelhub import SHConfig, BBox, CRS, SentinelHubRequest, MimeType, DataCollection
import numpy as np
from dotenv import load_dotenv
from real_world_to_softweare_utils import generate_grid

load_dotenv()
config = SHConfig()

config.sh_client_id = os.getenv("SENTINEL_CLIENT_ID")
config.sh_client_secret = os.getenv("SENTINEL_CLIENT_SECRET")

def get_ndvi(lon, lat, date_range=('2025-01-01', '2025-01-10'), pixel_size=1):
    """
    Returns NDVI and vegetation category at a given coordinate.

    Parameters:
        lon, lat: float - coordinate in WGS84
        date_range: tuple - start and end dates ('YYYY-MM-DD')
        pixel_size: int - pixel size for area averaging (default 1x1 pixel)
    Returns:
        dict: { 'ndvi': float, 'category': str }
    """

    bbox = BBox(bbox=(lon - 0.0005, lat - 0.0005, lon + 0.0005, lat + 0.0005), crs=CRS.WGS84)

    request = SentinelHubRequest(
        evalscript="""
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08"],
            output: { bands: 1, sampleType: "FLOAT32" }  // <-- important!
          };
        }
        
        function evaluatePixel(sample) {
          let nir = sample.B08 / 10000.0;
          let red = sample.B04 / 10000.0;
          let ndvi = (nir - red) / (nir + red + 1e-6);
          return [ndvi];
        }
        """,
        input_data=[SentinelHubRequest.input_data(
            data_collection=DataCollection.SENTINEL2_L2A,
            time_interval=date_range,
            mosaicking_order='leastCC'
        )],
        responses=[SentinelHubRequest.output_response('default', MimeType.TIFF)],
        bbox=bbox,
        size=(pixel_size, pixel_size),
        config=config
    )

    data = request.get_data()
    ndvi_array = np.array(data[0])

    ndvi_value = float(np.mean(ndvi_array))

    return round(ndvi_value, 3)

def get_ndvi_grid(start_lat, start_lon, end_lat, end_lon):
    ndvis = []
    lats, lons = generate_grid(start_lat, start_lon, end_lat, end_lon)

    for lat, lon in zip(lats.ravel(), lons.ravel()):
        ndvi = get_ndvi(lon, lat)
        ndvis.append(ndvi if ndvi is not None else np.nan)

    return np.array(ndvis).reshape(lats.shape)
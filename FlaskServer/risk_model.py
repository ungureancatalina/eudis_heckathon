def calculate_risk(weather):
    """
    Very simple rule-based risk calculation.
    """
    score = 0.0

    # Weather impact
    if "temp" in weather:
        if weather["temp"] < 0 or weather["temp"] > 35:
            score += 0.2
    if "wind_speed" in weather:
        if weather["wind_speed"] > 15:  # m/s
            score += 0.3
    if "description" in weather:
        if "rain" in weather["description"] or "storm" in weather["description"]:
            score += 0.3

    # Normalize score to 0-1
    if score > 1.0:
        score = 1.0

    recommendation = "GO" if score < 0.5 else "NO GO"

    return round(score, 2), recommendation

"""
Trip Service — berisi seluruh logika bisnis KelanaAI.
Dipisah dari main.py agar arsitektur berlapis (layered architecture):
main.py = presentation layer (I/O), trip_service.py = business logic layer.
"""


def get_trip_category(budget):
    """Menentukan kategori perjalanan berdasarkan budget."""
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"


# HOMEWORK: fungsi get_travel_season(month)
def get_travel_season(month):
    """Menentukan season perjalanan berdasarkan bulan (support string atau angka)."""
    month_str = str(month).strip().lower()
    if month_str in ("december", "12"):
        return "Peak Season"
    elif month_str in ("june", "6"):
        return "Holiday Season"
    else:
        return "Regular Season"


def calculate_daily_budget(budget, days):
    """Menghitung estimasi budget harian."""
    return budget / days


# Data rekomendasi tempat per destinasi (pakai list)
RECOMMENDED_PLACES = {
    "japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
    "korea": ["Gyeongbokgung Palace", "Myeongdong", "Busan Beach"],
    "indonesia": ["Borobudur", "Raja Ampat", "Malioboro"],
}
DEFAULT_PLACES = ["Local Market", "City Center", "Popular Landmark"]


def get_recommended_places(destination):
    """Mengambil daftar tempat rekomendasi untuk sebuah destinasi (list + loop for)."""
    places = RECOMMENDED_PLACES.get(destination.lower(), DEFAULT_PLACES)
    result = []
    for place in places:
        result.append(place)
    return result


# CORE CHALLENGE: rekomendasi transportasi berdasarkan kategori trip
def get_recommended_transportation(category):
    """Menentukan rekomendasi transportasi berdasarkan kategori perjalanan."""
    if category == "Backpacker":
        return "Bus"
    elif category == "Standard":
        return "Train"
    else:  # Luxury
        return "Flight"
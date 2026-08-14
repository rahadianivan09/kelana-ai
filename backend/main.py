from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places,
    get_recommended_transportation,
)


def print_trip_summary(destinations, days, budget, currency, travel_month,
                        category, daily_budget, season, transportation,
                        hotel_cost, food_cost, transport_cost, misc_cost, total_cost):
    """Mencetak ringkasan perjalanan dengan format yang rapi."""
    print("=" * 34)
    print("KelanaAI")
    print("=" * 34)

    # Sesi 1: data dasar (destination sekarang bisa multiple, lihat BONUS)
    print(f"Destination     : {', '.join(destinations)}")
    print(f"Days            : {days}")
    print(f"Budget          : {budget} {currency}")
    print(f"Category        : {category}")
    print(f"Daily Budget    : {daily_budget:.0f} {currency}/Day")
    print(f"Travel Month    : {travel_month}")

    # HOMEWORK: tampilkan Season
    print(f"Season          : {season}")

    # CORE CHALLENGE: tampilkan rekomendasi transportasi
    print(f"Recommended Transportation: {transportation}")

    # Sesi 1: cost breakdown
    print("-" * 34)
    print(f"Hotel Cost        : {hotel_cost} {currency}")
    print(f"Food Cost         : {food_cost} {currency}")
    print(f"Transportation    : {transport_cost} {currency}")
    print(f"Miscellaneous     : {misc_cost} {currency}")
    print(f"Total Est. Cost   : {total_cost} {currency}")

    if total_cost > budget:
        print("⚠ Budget exceeded.")

    # Rekomendasi tempat per destinasi (list + for loop, ada di service layer)
    print("-" * 34)
    for dest in destinations:
        places = get_recommended_places(dest)
        print(f"Recommended Places in {dest.title()}")
        for place in places:
            print(f"- {place}")


def main():
    # BONUS: multiple destinations pakai list + while loop
    destinations = []
    print("Enter your destinations (type 'done' when finished):")
    while True:
        dest = input(f"Destination {len(destinations) + 1}: ")
        if dest.lower() == "done":
            if len(destinations) == 0:
                print("Please enter at least one destination.")
                continue
            break
        destinations.append(dest)

    days = int(input("Days: "))
    budget = float(input("Budget: "))
    currency = input("Currency: ")
    travel_month = input("Travel Month: ")

    hotel_cost = float(input("Hotel Cost: "))
    food_cost = float(input("Food Cost: "))
    transport_cost = float(input("Transportation Cost: "))
    misc_cost = float(input("Miscellaneous Cost: "))
    total_cost = hotel_cost + food_cost + transport_cost + misc_cost

    # Panggil business logic dari service layer
    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)
    season = get_travel_season(travel_month)
    transportation = get_recommended_transportation(category)

    print_trip_summary(
        destinations, days, budget, currency, travel_month,
        category, daily_budget, season, transportation,
        hotel_cost, food_cost, transport_cost, misc_cost, total_cost
    )


if __name__ == "__main__":
    main()
def print_trip_summary(destination, country, days, budget, currency, travel_month,
                        hotel_cost, food_cost, transport_cost, misc_cost, total_cost):
    """Mencetak ringkasan perjalanan dengan format yang rapi."""
    print("=" * 24)
    print("KelanaAI")
    print("=" * 24)

    # HOMEWORK: menampilkan variabel dasar (destination, country, days, budget,
    # currency, travel_month) menggunakan f-strings
    print(f"Destination  : {destination}")
    print(f"Country      : {country}")
    print(f"Days         : {days}")
    print(f"Budget       : {budget} {currency}")
    print(f"Currency     : {currency}")
    print(f"Travel Month : {travel_month}")

    # CORE CHALLENGE: cost breakdown
    print("-" * 24)
    print(f"Hotel Cost        : {hotel_cost} {currency}")
    print(f"Food Cost         : {food_cost} {currency}")
    print(f"Transportation    : {transport_cost} {currency}")
    print(f"Miscellaneous     : {misc_cost} {currency}")
    print(f"Total Est. Cost   : {total_cost} {currency}")

    # BONUS: budget exceeded alert
    if total_cost > budget:
        print("⚠ Budget exceeded.")


def main():
    # HOMEWORK: input interaktif untuk data dasar perjalanan
    destination = input("Destination: ")
    country = input("Country: ")
    days = int(input("Days: "))            # konversi ke int
    budget = float(input("Budget: "))      # konversi ke float
    currency = input("Currency: ")
    travel_month = input("Travel Month: ")

    # CORE CHALLENGE: input cost breakdown
    hotel_cost = float(input("Hotel Cost: "))
    food_cost = float(input("Food Cost: "))
    transport_cost = float(input("Transportation Cost: "))
    misc_cost = float(input("Miscellaneous Cost: "))

    # CORE CHALLENGE: hitung total estimasi biaya
    total_cost = hotel_cost + food_cost + transport_cost + misc_cost

    print_trip_summary(
        destination, country, days, budget, currency, travel_month,
        hotel_cost, food_cost, transport_cost, misc_cost, total_cost
    )


if __name__ == "__main__":
    main()
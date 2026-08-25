// #HANDS-ON LAB — render hasil AI recommendation
// #CORE CHALLENGE — parse JSON terstruktur jadi daily cards, travel tips, food, budget breakdown
// #HANDS-ON LAB — error handling: kalau JSON gagal di-parse, fallback ke teks mentah (ga crash)
interface StructuredRecommendation {
  itinerary: { day: number; title: string; activities: string[] }[];
  travel_tips: string[];
  food_recommendations: string[];
  budget_breakdown: { category: string; amount: number }[];
}

export default function TripResult({ rawRecommendation }: { rawRecommendation: string }) {
  let data: StructuredRecommendation | null = null;
  try {
    data = JSON.parse(rawRecommendation);
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 whitespace-pre-wrap text-slate-700">
        {rawRecommendation}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-3 sm:grid-cols-2">
        {data.itinerary.map((day) => (
          <div key={day.day} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-blue-800">Day {day.day}</p>
            <p className="mt-1 font-medium text-slate-800">{day.title}</p>
            <ul className="mt-2 list-disc pl-4 text-sm text-slate-600 space-y-1">
              {day.activities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-teal-700 mb-2">Travel Tips</p>
        <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
          {data.travel_tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-teal-700 mb-2">Food Recommendations</p>
        <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
          {data.food_recommendations.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-blue-800 mb-2">Estimated Budget Breakdown</p>
        <div className="divide-y divide-slate-100 text-sm">
          {data.budget_breakdown.map((item, i) => (
            <div key={i} className="flex justify-between py-1.5 text-slate-600">
              <span>{item.category}</span>
              <span className="font-medium text-slate-800">${item.amount}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
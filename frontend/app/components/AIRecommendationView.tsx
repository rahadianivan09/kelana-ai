"use client";
import { AIRecommendation } from "@/types/trip";

export default function AIRecommendationView({ raw }: { raw: string | null | undefined }) {
  if (!raw) return <p className="text-gray-400 italic">No recommendation generated yet.</p>;

  let data: AIRecommendation;
  try {
    data = JSON.parse(raw);
  } catch {
    return <pre className="whitespace-pre-wrap text-sm">{raw}</pre>;
  }

  const totalBudget = data.budget_breakdown?.reduce((sum, b) => sum + b.amount, 0) ?? 0;

  return (
    <div className="space-y-8 mt-4">
      <div className="space-y-4">
        {data.itinerary?.map((day) => (
          <div key={day.day} className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Day {day.day}: {day.title}</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              {day.activities?.map((activity, i) => (
                <li key={i}>{activity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {data.travel_tips?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Travel Tips</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            {data.travel_tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      )}

      {data.food_recommendations?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Food Recommendations</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            {data.food_recommendations.map((food, i) => <li key={i}>{food}</li>)}
          </ul>
        </div>
      )}

      {data.budget_breakdown?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Budget Breakdown</h3>
          <div className="border rounded-lg divide-y">
            {data.budget_breakdown.map((item, i) => (
              <div key={i} className="flex justify-between px-3 py-2 text-sm">
                <span className="text-gray-600">{item.category}</span>
                <span className="font-medium">USD {item.amount.toLocaleString("en-US")}</span>
              </div>
            ))}
            <div className="flex justify-between px-3 py-2 text-sm font-semibold bg-gray-50">
              <span>Total</span>
              <span>USD {totalBudget.toLocaleString("en-US")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
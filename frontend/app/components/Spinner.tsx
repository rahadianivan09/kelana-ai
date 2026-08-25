// #BONUS — loading spinner saat nunggu Amazon Bedrock
export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-teal-600 py-10 text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <div className="text-center">
        <p className="font-semibold">Generating itinerary...</p>
        <p className="text-sm text-teal-50">Amazon Bedrock is thinking.</p>
      </div>
    </div>
  );
}
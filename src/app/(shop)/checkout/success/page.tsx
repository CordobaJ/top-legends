import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">¡Pedido confirmado!</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Recibirás un mensaje con los detalles de tu compra.
      </p>
      {order && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Número de pedido: <span className="font-medium text-zinc-900 dark:text-white">{order}</span>
        </p>
      )}
    </div>
  );
}

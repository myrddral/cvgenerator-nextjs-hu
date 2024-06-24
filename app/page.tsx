import Image from "next/image";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <section className='container gap-8'>
        <h1 className='font-display text-5xl font-bold leading-none tracking-wider'>
          Önéletrajz
          <br />
          Generátor
        </h1>
        <p className='text-center text-lg'>
          Generálj egyszerűen és gyorsan, ízlésesen formázott önéletrajzot!
        </p>
      </section>
    </main>
  );
}

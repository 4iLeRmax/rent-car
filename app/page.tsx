// 'use client'

// import CarCard from '@/components/CarCard';
// import CustomFilter from '@/components/CustomFilter';
// import Hero from '@/components/Hero';
// import SearchBar from '@/components/SearchBar';
// import ShowMore from '@/components/ShowMore';
// import { fuels, yearsOfProduction } from '@/constants';
// import { HomeProps } from '@/types';
// import { fetchCars } from '@/utils';

// export default async function Home({ searchParams }: HomeProps) {
// const allCars = await fetchCars({
//   manufacturer: manufacturer || '',
//   model: model || '',
//   year: year || 2022,
//   fuel: fuel || '',
//   limit: limit || 10,
// });

//   const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

//   return (
//     <main className='overflow-hidden'>
//       <Hero />

//       <div className='mt-12 padding-x padding-y max-width' id='discover'>
//         <div className='home__text-container'>
//           <h1 className='text-xl font-extrabold'>Car Catalogue</h1>
//           <p>Explore the cars you might like</p>
//         </div>

//         <div className='home__filters'>
//           <SearchBar />

//           <div className='home__filter-container'>
//             <CustomFilter title='fuel' options={fuels} />
//             <CustomFilter title='year' options={yearsOfProduction} />
//           </div>
//         </div>

//         {!isDataEmpty ? (
//           <section>
//             <div className='home__cars-wrapper'>
//               {allCars?.map((car) => (
//                 <CarCard car={car} />
//               ))}
//             </div>

//             <ShowMore
//               pageNumber={(limit || 10) / 10}
//               isNext={(limit || 10) > allCars.length}
//             />
//           </section>
//         ) : (
//           <div className='home__error-container'>
//             <h2 className='text-xl font-bold text-black'>Oops, no results</h2>
//             <p>{allCars?.message}</p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { fetchCars } from '@/utils';
import { fuels, yearsOfProduction } from '@/constants';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import CustomFilter from '@/components/CustomFilter';
import CarCard from '@/components/CarCard';
import ShowMore from '@/components/ShowMore';

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // search states
  const [manufacturer, setManuFacturer] = useState('');
  const [model, setModel] = useState('');

  // filter state
  const [fuel, setFuel] = useState('');
  const [year, setYear] = useState(2022);

  // limit state
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const result = await fetchCars({
        manufacturer: manufacturer.toLowerCase() || '',
        model: model.toLowerCase() || '',
        fuel: fuel.toLowerCase() || '',
        year: year || 2022,
        limit: limit || 10,
      });

      setAllCars(result);
    } catch {
      console.error();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [fuel, year, limit, manufacturer, model]);

  return (
    <main className='overflow-hidden'>
      <Hero />

      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className='home__filters'>
          <SearchBar setManuFacturer={setManuFacturer} setModel={setModel} />

          <div className='home__filter-container'>
            <CustomFilter options={fuels} setFilter={setFuel} />
            <CustomFilter options={yearsOfProduction} setFilter={setYear} />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className='home__cars-wrapper'>
              {allCars?.map((car, index) => (
                <CarCard key={`car-${index}`} car={car} />
              ))}
            </div>

            {loading && (
              <div className='w-full mt-16 flex-center'>
                <Image
                  src='./loader.svg'
                  alt='loader'
                  width={50}
                  height={50}
                  className='object-contain'
                />
              </div>
            )}

            <ShowMore pageNumber={limit / 10} isNext={limit > allCars.length} setLimit={setLimit} />
          </section>
        ) : (
          !loading && (
            <div className='home__error-container'>
              <h2 className='text-xl font-bold text-black'>Oops, no results</h2>
            </div>
          )
        )}
      </div>
    </main>
  );
}

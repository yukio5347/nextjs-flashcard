import { Card, Word } from '@prisma/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Circle, Eraser, Home, Pen, Play, Rotate, ThumbsUp, Xmark } from '@/components/Icon';
import ProgressBar from '@/components/ProgressBar';
import Toggle from '@/components/Toggle';
import { cardStaticPaths, cardStaticProps } from '@/lib/queries';

export const getStaticProps: GetStaticProps = async ({ params }) => cardStaticProps(params);
export const getStaticPaths: GetStaticPaths = async () => cardStaticPaths();

export type CardType = Card & {
  words: Word[];
};

export default function Index({ card }: { card: CardType }) {
  const [isRandom, setIsRandom] = useState(true);
  const [isBackward, setIsBackward] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [words, setWords] = useState(card.words);
  const [correctedWords, setCorrectedWords] = useState<number[]>([]);
  const [missedWords, setMissedWords] = useState<number[]>([]);
  const [index, setIndex] = useState(0);

  function shuffleWords() {
    const array = words;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setWords(array);
  }

  const nextWord = (corrected: boolean) => {
    setIndex((prevState) => prevState + 1);
    setShowAnswer(false);

    if (corrected) {
      setCorrectedWords((prevState) => [...prevState, index]);
    } else {
      setMissedWords((prevState) => [...prevState, index]);
    }
  };

  const startCard = (reset = false) => {
    reset && setWords(card.words);
    setIndex(0);
    setShowAnswer(false);
    setCorrectedWords([]);
    setMissedWords([]);
  };

  const tryMissedWords = () => {
    const newWords = missedWords.map((index) => words[index]);
    setWords(newWords);
    startCard();
  };

  // const eraseCorrectedWords = async (card: Card, index: number) => {
  //   if (confirm(`You are about to remove "${correctedWords.length}" words`)) {
  //     fetch(`/api/cards/${card.id}`, {
  //       method: 'PATCH',
  //     })
  //       .then((res) => {
  //         if (res.ok) {
  //           mutate(data);
  //         }
  //         return res.json();
  //       })
  //       .then((json) => showAlert(json.type, json.message));
  //   }
  // };

  useEffect(() => {
    startCard();
    isRandom && shuffleWords();
  }, [words, isRandom, isBackward]);

  return (
    <>
      <h1 className='mb-5 text-lg font-semibold'>{card.title}</h1>
      <div className='grid grid-cols-2 gap-x-10 gap-y-8 text-2xl'>
        {words[index] ? (
          <>
            <div className='relative p-5 w-full h-80 flex items-center justify-center'>
              <p>{isBackward ? words[index].back : words[index].front}</p>
              {showAnswer && <p className='absolute bottom-20 text-lg'>{words[index].example}</p>}
            </div>
            {showAnswer ? (
              <div className='relative flex items-center justify-center'>
                <div>{isBackward ? words[index].front : words[index].back}</div>
                <div className='absolute bottom-5 grid grid-cols-2 gap-10'>
                  <button
                    onClick={() => nextWord(false)}
                    className='text-lg border shadow transition-shadow hover:shadow-lg rounded-md py-3 px-5'
                  >
                    <Xmark /> Missed
                  </button>
                  <button
                    onClick={() => nextWord(true)}
                    className='text-lg border shadow transition-shadow hover:shadow-lg rounded-md py-3 px-5'
                  >
                    <Circle /> Corrected
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className='border shadow transition-shadow hover:shadow-lg p-5 w-full h-80 flex items-center justify-center rounded-lg'
              >
                <span className='animate-bounce text-4xl'>?</span>
              </button>
            )}
          </>
        ) : (
          <>
            <div className='col-span-2 grid grid-cols-3 gap-10 text-lg'>
              <Link
                href='/'
                className='p-5 w-full h-36 items-center justify-center rounded-lg flex flex-col shadow transition-shadow hover:shadow-lg'
              >
                Back to home
                <Home />
              </Link>
              <Link
                href={`/cards/${card.id}/edit`}
                className='p-5 w-full h-36 items-center justify-center rounded-lg flex flex-col shadow transition-shadow hover:shadow-lg'
              >
                Edit the Card
                <Pen />
              </Link>
              {/* <button
                onClick={eraseCorrectedWords}
                className='p-5 w-full h-36 items-center justify-center rounded-lg flex flex-col shadow transition-shadow hover:shadow-lg'
              >
                Remove Corrected Words
                <Eraser />
              </button> */}
            </div>
            <button
              onClick={() => startCard(true)}
              className='p-5 w-full h-36 items-center justify-center rounded-lg flex flex-col shadow transition-shadow hover:shadow-lg'
            >
              Reset
              <Rotate />
            </button>
            {missedWords.length > 0 ? (
              <button
                onClick={tryMissedWords}
                className='p-5 w-full h-36 items-center justify-center rounded-lg flex flex-col shadow transition-shadow hover:shadow-lg'
              >
                Try Missed Words ({missedWords.length})
                <Play />
              </button>
            ) : (
              <div className='p-5 w-full h-36 items-center justify-center rounded-lg flex flex-col'>
                All Correct!!
                <ThumbsUp />
              </div>
            )}
          </>
        )}
      </div>
      <ProgressBar molecule={index} denominator={words.length} />

      <div className='flex items-start justify-between mt-10'>
        <div className='flex flex-col gap-5'>
          <Toggle label='Random' checked={isRandom} onChange={() => setIsRandom((prevState) => !prevState)} />
          <Toggle label='Backward' checked={isBackward} onChange={() => setIsBackward((prevState) => !prevState)} />
        </div>
        <p className='float-right'>
          <Link
            href='/'
            className='py-2 px-4 inline-block rounded bg-gray-200 text-sm transition-colors hover:bg-gray-300'
          >
            Back to home
          </Link>
        </p>
      </div>
      <hr className='mt-10' />
      <div className='grid grid-cols-2 gap-5'>
        <div className=''>
          <h4 className='my-3 font-semibold'>Corrected Words</h4>
          <ul className='list-disc list-inside'>
            {correctedWords.map((index) => (
              <li key={index}>
                {words[index].front} / {words[index].back}
              </li>
            ))}
          </ul>
        </div>
        <div className=''>
          <h4 className='my-3 font-semibold'>Missed Words</h4>
          <ul className='list-disc list-inside'>
            {missedWords.map((index) => (
              <li key={index}>
                {words[index].front} / {words[index].back}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

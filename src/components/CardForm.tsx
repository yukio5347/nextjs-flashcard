import pick from 'lodash.pick';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useAlertContext } from '@/components/Alert';
import { getErrorMessage } from '@/lib/helpers';
import { CardData } from '@/models/Card';

const getData = (cardData: CardData) => {
  return pick(cardData, ['title', 'content']);
};

export const CardForm = ({ card = { title: '', content: '' } }: { card?: CardData }) => {
  const [cardData, setCardData] = useState<CardData>(card);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlertContext();

  const store = async (cardData: CardData): Promise<void> => {
    const data = getData(cardData);
    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          router.push('/');
        }
        return res.json();
      })
      .then((json) => showAlert(json.type, json.message))
      .catch((error) => {
        showAlert('error', getErrorMessage(error));
        console.error(error);
      });
  };

  const update = async (id: number, cardData: CardData): Promise<void> => {
    const data = getData(cardData);
    fetch(`/api/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          router.push('/');
        }
        return res.json();
      })
      .then((json) => showAlert(json.type, json.message))
      .catch((error) => {
        showAlert('error', getErrorMessage(error));
        console.error(error);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    card.id ? update(card.id, cardData) : store(cardData);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        autoFocus
        required
        onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
        placeholder='Card Title'
        type='text'
        name='title'
        value={cardData.title}
        className='p-4 mb-5 w-full border border-gray-300 rounded-lg'
      />
      <textarea
        required
        onChange={(e) => setCardData({ ...cardData, content: e.target.value })}
        rows={8}
        placeholder='merah,red'
        value={cardData.content}
        className='p-4 w-full border border-gray-300 rounded-lg'
      />
      <p className='text-sm text-gray-500'>* 1 line and comma separated for a word pair</p>
      <div className='flex justify-between mt-5'>
        <button
          disabled={!cardData.title || !cardData.content || processing}
          className='w-20 py-2 px-4 inline-block rounded bg-sky-500 text-sm text-white transition-colors hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-500'
        >
          {processing ? (
            <svg
              className='animate-spin h-5 w-5 m-auto text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : (
            <>{card.id ? 'Update' : 'Save'}</>
          )}
        </button>
        <Link
          href='/'
          className='w-20 py-2 px-4 inline-block rounded bg-gray-200 text-sm transition-colors hover:bg-gray-300'
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};

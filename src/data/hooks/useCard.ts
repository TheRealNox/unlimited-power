import {
  type InfiniteData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { CardResponseSchema } from '@data/CardResponse';
import type { CardsResponse } from '@data/CardsResponse';
import { useCardsQueryKey } from '@data/hooks/useCardsQueryKey';

const fetchCard = async (id: number) => {
  const response = await (
    await fetch(`https://admin.starwarsunlimited.com/api/cards/${id}`)
  ).json();

  const parsed = CardResponseSchema.parse(response);
  return parsed.data;
};

export function useCard(cardId: number) {
  const cardsQueryKey = useCardsQueryKey();

  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['card', cardId],
    queryFn: () => fetchCard(cardId),
    enabled: !!cardId,
    placeholderData: () => {
      const data =
        queryClient.getQueryData<InfiniteData<CardsResponse>>(cardsQueryKey);

      const card = data?.pages
        .map((page) => page.data.find((card) => card.id === cardId))
        .find(Boolean);

      return card;
    },
  });
}

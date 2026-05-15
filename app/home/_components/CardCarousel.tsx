import CardComponent from '@/components/CardComponent';
import { Card } from '@/lib/api';
import { motion, useMotionValue, animate, type PanInfo } from 'framer-motion';
import { useState } from 'react';

interface CardCarouselProps {
  cards: Card[];
  balancesVisible: boolean;
}

const CARD_STRIDE = 320 + 16;

const CardCarousel = ({ cards, balancesVisible }: CardCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);

  const snapTo = (index: number) => {
    setActiveIndex(index);
    animate(x, -index * CARD_STRIDE, {
      type: 'spring',
      stiffness: 320,
      damping: 32,
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    let next = activeIndex;

    if (velocity < -300 || offset < -CARD_STRIDE / 3) {
      next = Math.min(activeIndex + 1, cards.length - 1);
    } else if (velocity > 300 || offset > CARD_STRIDE / 3) {
      next = Math.max(activeIndex - 1, 0);
    }
    snapTo(next);
  };
  return (
    <div className="pl-6">
      <div className="overflow-x-clip py-3 -my-3">
        <motion.div
          className="flex gap-4 select-none cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -(cards.length - 1) * CARD_STRIDE,
            right: 0,
          }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {cards.map((card, i) => (
            <div key={card.id} className="flex-shrink-0">
              <CardComponent
                card={card}
                index={i}
                balanceVisible={balancesVisible}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CardCarousel;

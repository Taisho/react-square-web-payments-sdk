// Vendor Modules
import { CSSObject } from '@emotion/styled';
import { document } from 'browser-monads-ts';
import * as React from 'react';
import { useEvent } from 'react-use';
import type { GiftCard, GiftCardOptions } from '@square/web-sdk';

// Internals
import { useForm } from '../../hooks';
import { LoadingCard, PayButton } from './styles';
import { renderWithoutSupportPaymentMethod } from '../../utils';

interface Props extends GiftCardOptions {
  overrideStyles?: CSSObject | undefined;
}

export const GiftCardInput = ({
  overrideStyles,
  ...props
}: Props): JSX.Element | null => {
  const [gCard, setGCard] = React.useState<GiftCard | undefined>(
    () => undefined
  );
  const { giftCard, payments } = useForm();

  const handlePayment = async () => {
    try {
      const result = await gCard?.tokenize();

      console.log(result);
    } catch (ex) {
      console.error(ex);
    }
  };

  const start = async () => {
    const gCard = await payments.giftCard(props).then((res) => {
      setGCard(res);

      return res;
    });

    await gCard?.attach('#gift-card-container');
  };

  React.useEffect(() => {
    start();
  }, [payments]);

  useEvent(
    'click',
    handlePayment,
    document.getElementById('pay-with-gift-card')
  );

  if (giftCard !== 'ready') {
    renderWithoutSupportPaymentMethod('Gift Card');

    return null;
  }

  return (
    <>
      <div id="gift-card-container" style={{ minHeight: 89 }}>
        {!gCard && <LoadingCard />}
      </div>

      <PayButton
        id="pay-with-gift-card"
        type="button"
        overrideStyles={overrideStyles}
      >
        Pay with Gift Card
      </PayButton>
    </>
  );
};

export default GiftCardInput;

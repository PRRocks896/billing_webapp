import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

type Props = React.ComponentProps<typeof FormattedMessage> & {
  // allow any type since many call sites pass variables
  id?: any;
};

// ==============================|| COMPONENT: SAFE FORMATTED MESSAGE ||============================== //

export default function SafeFormattedMessage({ id, defaultMessage, ...rest }: Props) {
  if (typeof id === 'string' && id.trim().length > 0) {
    return <FormattedMessage id={id} defaultMessage={defaultMessage ?? id} {...rest} />;
  }

  // If `id` is not a non-empty string, prefer `defaultMessage` if provided
  if (defaultMessage) return <>{defaultMessage}</>;

  // Fallback: render the id value (stringify) so UI still shows something instead of throwing
  if (id !== undefined && id !== null) return <>{String(id)}</>;

  return <></>;
}

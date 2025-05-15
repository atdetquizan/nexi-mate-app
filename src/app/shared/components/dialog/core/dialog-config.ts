import { DialogSize } from '../enums';

export class DialogConfig<D = unknown> {
  backdrop?: boolean;
  type?: 'custom' | 'warning' | 'error' | 'success' | 'info';
  img?: string;
  title?: string;
  message?: string;
  data?: D;
  classname?: DialogSize | string;
  isClosed?: boolean;
  buttons?: {
    accept?: string;
    isAccept?: boolean;
    exit?: string;
    isExit?: boolean;
  }
}

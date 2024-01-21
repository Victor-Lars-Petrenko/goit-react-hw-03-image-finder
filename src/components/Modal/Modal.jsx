import { Component } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

export class Modal extends Component {
  state = {};

  componentDidMount() {
    document.addEventListener('keydown', this.closeModal);

    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = 'fixed';
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.closeModal);

    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  closeModal = ({ target, currentTarget, code }) => {
    if (target === currentTarget || code === 'Escape') {
      this.props.close();
    }
  };

  render() {
    const { closeModal } = this;
    const { children } = this.props;
    const modalRoot = document.querySelector('#modal-root');
    return createPortal(
      <div className={css.overlay} onClick={closeModal}>
        <div className={css.modal}>{children}</div>
      </div>,
      modalRoot
    );
  }
}

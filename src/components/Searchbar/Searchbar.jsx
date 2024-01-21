import { Component } from 'react';
import { IoMdSearch } from 'react-icons/io';
import css from './Searchbar.module.css';

import { toast } from 'react-toastify';

export class Searchbar extends Component {
  state = {
    keyWord: '',
  };

  handleSubmit = e => {
    e.preventDefault();

    const { keyWord } = this.state;
    const validKeyWord = keyWord.trim();

    this.reset();

    if (validKeyWord === '') {
      return toast.warning('Please fill empty field');
    }

    this.props.onSubmit(validKeyWord);
  };

  reset = () => {
    this.setState({ keyWord: '' });
  };

  handleChange = e => {
    this.setState({ keyWord: e.target.value });
  };

  render() {
    const { keyWord } = this.state;
    return (
      <header className={css.searchbar}>
        <form className={css.form} onSubmit={this.handleSubmit}>
          <button type="submit" className={css.button}>
            <span className={css.buttonLabel}>
              <IoMdSearch className={css.buttonLabel} />
            </span>
          </button>

          <input
            className={css.input}
            name="formInput"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={keyWord}
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}

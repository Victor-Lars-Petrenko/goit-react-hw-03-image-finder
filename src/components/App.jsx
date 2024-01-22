import { Component } from 'react';

import { getImages } from '../api/pixabay';
import css from './App.module.css';

import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Loader } from './Loader';
import { Button } from './Button';
import { Modal } from './Modal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class App extends Component {
  state = {
    keyWord: '',
    results: [],
    page: 0,
    loading: false,
    loadMore: false,
    imageToShow: {
      imageUrl: '',
      tags: '',
    },
    openModal: false,
  };

  componentDidUpdate(_, prevState) {
    if (
      prevState.keyWord !== this.state.keyWord ||
      prevState.page !== this.state.page
    ) {
      const { keyWord, page } = this.state;
      this.updateQueryResult(keyWord, page)
        .then(totalHits => {
          if (totalHits === 0) {
            return toast.info('Sorry, there are no results for your request');
          }
          if (page === 1) {
            return toast.success(
              `We found ${totalHits} ${totalHits === 1 ? 'result' : 'results'}`
            );
          }
          if (page < Math.ceil(totalHits / 12)) {
            const rest = totalHits - page * 12;
            return toast.success(
              `We found ${rest} more ${rest === 1 ? 'result' : 'results'}`
            );
          }
          if (page === Math.ceil(totalHits / 12)) {
            return toast.info('There are no more results for this request');
          }
        })
        .catch(() => toast.error('Something get wrong'))
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  }

  updateQueryResult = async (searchQuery, pageNumber) => {
    this.setState({ loading: true });
    const { totalHits, hits } = await getImages(searchQuery, pageNumber);
    this.setState(prev => ({
      results: [...prev.results, ...hits],
      page: pageNumber,
      loadMore: pageNumber < Math.ceil(totalHits / 12),
    }));
    return totalHits;
  };

  incrementPage = () => {
    this.setState(prev => ({ page: prev.page + 1 }));
  };

  handleFormSubmit = keyWord => {
    const validatedKey = keyWord.toLowerCase();
    if (this.state.keyWord === validatedKey) {
      return toast.info(
        `You are already viewing results for the query "${keyWord}"`
      );
    }
    this.setState({ keyWord: validatedKey, page: 1, results: [] });
  };

  handleItemClick = (imageUrl, tags) => {
    this.setState({
      openModal: true,
      imageToShow: {
        imageUrl,
        tags,
      },
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
      imageToShow: {
        imageUrl: '',
        tags: '',
      },
    });
  };

  render() {
    const { handleFormSubmit, incrementPage, handleItemClick, closeModal } =
      this;
    const {
      results,
      loading,
      loadMore,
      openModal,
      imageToShow: { imageUrl, tags },
    } = this.state;
    return (
      <section className={css.app}>
        <Searchbar onSubmit={handleFormSubmit} />
        {results[0] && (
          <ImageGallery items={results} onClick={handleItemClick} />
        )}
        {loading && <Loader />}
        {loadMore && !loading && <Button onClick={incrementPage} />}
        {openModal && (
          <Modal close={closeModal}>
            <img src={imageUrl} alt={tags}></img>
          </Modal>
        )}
        <ToastContainer autoClose={3000} />
      </section>
    );
  }
}

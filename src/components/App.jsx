import { Component } from 'react';

import { getImages } from './helpers/api';
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
    const prevWord = prevState.keyWord;
    const newWord = this.state.keyWord;
    if (prevWord !== newWord) {
      this.setState({ results: [] });
      this.updateQueryResult(newWord, 1)
        .then(({ total }) => {
          if (total === 0) {
            toast.info('Sorry, there are no results for your request');
          } else {
            toast.success(
              `We found ${total} ${total === 1 ? 'result' : 'results'}`
            );
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
    return { total: totalHits, pageNumber };
  };

  paginate = () => {
    const { keyWord, page } = this.state;
    this.updateQueryResult(keyWord, page + 1)
      .then(({ total, pageNumber }) => {
        if (pageNumber < Math.ceil(total / 12)) {
          toast.success(`We found ${total - pageNumber * 12} more results`);
        } else {
          toast.info('There are no more results for this request');
        }
      })
      .catch(() => toast.error('Something get wrong'))
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleFormSubmit = keyWord => {
    this.setState({ keyWord });
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
    const { handleFormSubmit, paginate, handleItemClick, closeModal } = this;
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
        {loadMore && !loading && <Button onClick={paginate} />}
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

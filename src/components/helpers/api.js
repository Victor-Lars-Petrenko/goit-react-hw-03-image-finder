import axios from 'axios';

export async function getImages(searchQuery, pageNumber) {
  const searchParams = new URLSearchParams({
    key: '40998615-e942d78fa7d7f729cbc4e5126',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    page: pageNumber,
    per_page: 12,
  });
  const URL = `https://pixabay.com/api/?${searchParams}`;

  const fetchResult = await axios.get(URL);
  const { data } = fetchResult;

  return data;
}

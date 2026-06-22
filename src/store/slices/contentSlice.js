import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const initialState = {
  articles: { list: [], total: 0, pages: 1, page: 1, current: null, loading: false, error: null },
  fatwas: { list: [], total: 0, pages: 1, page: 1, current: null, loading: false, error: null },
  questions: { list: [], publicList: [], pages: 1, page: 1, total: 0, current: null, loading: false, error: null },
  publications: { list: [], loading: false, error: null },
  lectures: { list: [], loading: false, error: null },
  events: { list: [], loading: false, error: null },
  contacts: { list: [], loading: false, error: null },
  actionLoading: false,
  actionError: null,
};

// ================= ARTICLES THUNKS =================
export const fetchArticles = createAsyncThunk(
  'content/fetchArticles',
  async ({ category = '', search = '', page = 1, limit = 6 } = {}, thunkAPI) => {
    try {
      const { data } = await API.get(`/articles?category=${category}&search=${search}&page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchArticleBySlug = createAsyncThunk(
  'content/fetchArticleBySlug',
  async (slug, thunkAPI) => {
    try {
      const { data } = await API.get(`/articles/slug/${slug}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createArticle = createAsyncThunk(
  'content/createArticle',
  async (articleData, thunkAPI) => {
    try {
      const { data } = await API.post('/articles', articleData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'content/updateArticle',
  async ({ id, articleData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/articles/${id}`, articleData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'content/deleteArticle',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/articles/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= FATWAS THUNKS =================
export const fetchFatwas = createAsyncThunk(
  'content/fetchFatwas',
  async ({ category = '', search = '', page = 1, limit = 6 } = {}, thunkAPI) => {
    try {
      const { data } = await API.get(`/fatwas?category=${category}&search=${search}&page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFatwaById = createAsyncThunk(
  'content/fetchFatwaById',
  async (id, thunkAPI) => {
    try {
      const { data } = await API.get(`/fatwas/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createFatwa = createAsyncThunk(
  'content/createFatwa',
  async (fatwaData, thunkAPI) => {
    try {
      const { data } = await API.post('/fatwas', fatwaData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateFatwa = createAsyncThunk(
  'content/updateFatwa',
  async ({ id, fatwaData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/fatwas/${id}`, fatwaData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFatwa = createAsyncThunk(
  'content/deleteFatwa',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/fatwas/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= QUESTIONS THUNKS =================
export const submitQuestion = createAsyncThunk(
  'content/submitQuestion',
  async (questionData, thunkAPI) => {
    try {
      const { data } = await API.post('/questions/ask', questionData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPublicQuestions = createAsyncThunk(
  'content/fetchPublicQuestions',
  async ({ category = '', search = '', page = 1, limit = 6 } = {}, thunkAPI) => {
    try {
      const { data } = await API.get(`/questions/public?category=${category}&search=${search}&page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPublicQuestionById = createAsyncThunk(
  'content/fetchPublicQuestionById',
  async (id, thunkAPI) => {
    try {
      const { data } = await API.get(`/questions/public/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAdminQuestions = createAsyncThunk(
  'content/fetchAdminQuestions',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/questions');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const answerQuestion = createAsyncThunk(
  'content/answerQuestion',
  async ({ id, answerData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/questions/answer/${id}`, answerData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'content/deleteQuestion',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/questions/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= PUBLICATIONS THUNKS =================
export const fetchPublications = createAsyncThunk(
  'content/fetchPublications',
  async ({ category = '', search = '' } = {}, thunkAPI) => {
    try {
      const { data } = await API.get(`/publications?category=${category}&search=${search}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPublication = createAsyncThunk(
  'content/createPublication',
  async (pubData, thunkAPI) => {
    try {
      const { data } = await API.post('/publications', pubData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePublication = createAsyncThunk(
  'content/updatePublication',
  async ({ id, pubData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/publications/${id}`, pubData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePublication = createAsyncThunk(
  'content/deletePublication',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/publications/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= LECTURES THUNKS =================
export const fetchLectures = createAsyncThunk(
  'content/fetchLectures',
  async ({ category = '', search = '' } = {}, thunkAPI) => {
    try {
      const { data } = await API.get(`/lectures?category=${category}&search=${search}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createLecture = createAsyncThunk(
  'content/createLecture',
  async (lectureData, thunkAPI) => {
    try {
      const { data } = await API.post('/lectures', lectureData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateLecture = createAsyncThunk(
  'content/updateLecture',
  async ({ id, lectureData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/lectures/${id}`, lectureData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteLecture = createAsyncThunk(
  'content/deleteLecture',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/lectures/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= EVENTS THUNKS =================
export const fetchEvents = createAsyncThunk(
  'content/fetchEvents',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/events');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'content/createEvent',
  async (eventData, thunkAPI) => {
    try {
      const { data } = await API.post('/events', eventData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'content/updateEvent',
  async ({ id, eventData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/events/${id}`, eventData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'content/deleteEvent',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= CONTACTS THUNKS =================
export const submitContact = createAsyncThunk(
  'content/submitContact',
  async (contactData, thunkAPI) => {
    try {
      const { data } = await API.post('/contacts', contactData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchContacts = createAsyncThunk(
  'content/fetchContacts',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/contacts');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markContactReadStatus = createAsyncThunk(
  'content/markContactReadStatus',
  async (id, thunkAPI) => {
    try {
      const { data } = await API.put(`/contacts/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'content/deleteContact',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/contacts/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearContentErrors: (state) => {
      state.actionError = null;
      state.articles.error = null;
      state.fatwas.error = null;
      state.questions.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => { state.articles.loading = true; })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles.loading = false;
        state.articles.list = action.payload.articles;
        state.articles.page = action.payload.page;
        state.articles.pages = action.payload.pages;
        state.articles.total = action.payload.total;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.articles.loading = false;
        state.articles.error = action.payload;
      })
      // Fetch Article Detail
      .addCase(fetchArticleBySlug.pending, (state) => { state.articles.loading = true; })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.articles.loading = false;
        state.articles.current = action.payload; // contains { article, related }
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.articles.loading = false;
        state.articles.error = action.payload;
      })

      // Fetch Fatwas
      .addCase(fetchFatwas.pending, (state) => { state.fatwas.loading = true; })
      .addCase(fetchFatwas.fulfilled, (state, action) => {
        state.fatwas.loading = false;
        state.fatwas.list = action.payload.fatwas;
        state.fatwas.page = action.payload.page;
        state.fatwas.pages = action.payload.pages;
        state.fatwas.total = action.payload.total;
      })
      .addCase(fetchFatwas.rejected, (state, action) => {
        state.fatwas.loading = false;
        state.fatwas.error = action.payload;
      })
      // Fetch Fatwa Detail
      .addCase(fetchFatwaById.pending, (state) => { state.fatwas.loading = true; })
      .addCase(fetchFatwaById.fulfilled, (state, action) => {
        state.fatwas.loading = false;
        state.fatwas.current = action.payload; // contains { fatwa, related }
      })
      .addCase(fetchFatwaById.rejected, (state, action) => {
        state.fatwas.loading = false;
        state.fatwas.error = action.payload;
      })

      // Fetch Public Answered Questions
      .addCase(fetchPublicQuestions.pending, (state) => { state.questions.loading = true; })
      .addCase(fetchPublicQuestions.fulfilled, (state, action) => {
        state.questions.loading = false;
        state.questions.publicList = action.payload.questions;
        state.questions.page = action.payload.page;
        state.questions.pages = action.payload.pages;
        state.questions.total = action.payload.total;
      })
      .addCase(fetchPublicQuestions.rejected, (state, action) => {
        state.questions.loading = false;
        state.questions.error = action.payload;
      })
      // Fetch Public Question Detail
      .addCase(fetchPublicQuestionById.pending, (state) => { state.questions.loading = true; })
      .addCase(fetchPublicQuestionById.fulfilled, (state, action) => {
        state.questions.loading = false;
        state.questions.current = action.payload; // contains { question, related }
      })
      .addCase(fetchPublicQuestionById.rejected, (state, action) => {
        state.questions.loading = false;
        state.questions.error = action.payload;
      })

      // Fetch Admin Questions
      .addCase(fetchAdminQuestions.pending, (state) => { state.questions.loading = true; })
      .addCase(fetchAdminQuestions.fulfilled, (state, action) => {
        state.questions.loading = false;
        state.questions.list = action.payload;
      })
      .addCase(fetchAdminQuestions.rejected, (state, action) => {
        state.questions.loading = false;
        state.questions.error = action.payload;
      })

      // Fetch Publications
      .addCase(fetchPublications.pending, (state) => { state.publications.loading = true; })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.publications.loading = false;
        state.publications.list = action.payload;
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.publications.loading = false;
        state.publications.error = action.payload;
      })

      // Fetch Lectures
      .addCase(fetchLectures.pending, (state) => { state.lectures.loading = true; })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.lectures.loading = false;
        state.lectures.list = action.payload;
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.lectures.loading = false;
        state.lectures.error = action.payload;
      })

      // Fetch Events
      .addCase(fetchEvents.pending, (state) => { state.events.loading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events.loading = false;
        state.events.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.events.loading = false;
        state.events.error = action.payload;
      })

      // Fetch Admin Contacts Messages
      .addCase(fetchContacts.pending, (state) => { state.contacts.loading = true; })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts.loading = false;
        state.contacts.list = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.contacts.loading = false;
        state.contacts.error = action.payload;
      })

      // Action loadings (CRUD Operations updates)
      .addMatcher(
        (action) =>
          action.type.endsWith('/pending') &&
          (action.type.startsWith('content/create') ||
            action.type.startsWith('content/update') ||
            action.type.startsWith('content/delete') ||
            action.type.startsWith('content/answer') ||
            action.type.startsWith('content/submit')),
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith('/fulfilled') &&
          (action.type.startsWith('content/create') ||
            action.type.startsWith('content/update') ||
            action.type.startsWith('content/delete') ||
            action.type.startsWith('content/answer') ||
            action.type.startsWith('content/submit')),
        (state) => {
          state.actionLoading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith('/rejected') &&
          (action.type.startsWith('content/create') ||
            action.type.startsWith('content/update') ||
            action.type.startsWith('content/delete') ||
            action.type.startsWith('content/answer') ||
            action.type.startsWith('content/submit')),
        (state, action) => {
          state.actionLoading = false;
          state.actionError = action.payload;
        }
      );
  },
});

export const { clearContentErrors } = contentSlice.actions;
export default contentSlice.reducer;

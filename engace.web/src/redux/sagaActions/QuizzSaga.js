import { call, put, takeLatest } from "redux-saga/effects";
import * as SagaActionTypes from "../constants";
import { quizzActions } from "../reducer/QuizzReducer";
import { AppService } from "../../services/api";

function* actGetTopics(action) {
  const { level, onLoading, onFinish } = action;
  try {
    onLoading();
    const res = yield call(() => AppService.getSuggestTopics(level));
    const { status, data } = res;
    console.log(res);
    if (status === 201) {
      yield put(quizzActions.getTopicsSuccess({ topics: data }));
    } else {
      console.log(data.error);
    }
  } catch (err) {
    console.log(err);
  } finally {
    onFinish();
  }
}

function* actGetQuizzTypes(action) {
  const { onLoading, onFinish } = action;
  try {
    onLoading();
    const res = yield call(() => AppService.getQuizzTypes());
    const { status, data } = res;
    console.log(res);
    if (status === 200) {
      yield put(quizzActions.getQuizzTypesSuccess({ qTypes: data }));
    } else {
      console.log(data.error);
    }
  } catch (err) {
    console.log(err);
  } finally {
    onFinish();
  }
}

export function* followActSendMessage() {
  yield takeLatest(SagaActionTypes.GET_SUGGEST_TOPICS, actGetTopics);
}

export function* followActGetQuizzTypes() {
  yield takeLatest(SagaActionTypes.GET_QUIZ_TYPES, actGetQuizzTypes);
}

import { axiospost } from './axios'

//  获取文章系统的tags及对应的文章标题
export const getTags = function (lang) {
  return axiospost(`/help_center/articletag/all?lang=${lang}`)
}

//  获取一篇文章内容
export const getArticle = function (id, lang) {
  return axiospost(`/help_center/article/one?lang=${lang}`, {articleId: id})
}

// /help_center/articletag/foreach 获取单个目录下所有的文章
export const getArticlesByTag = function (id) {
  return axiospost(`/help_center/articletag/foreach`, {tagId: id})
}

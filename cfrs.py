import scipy.stats as stats
import numpy as np
import matplotlib.pyplot as plt
import itertools

class MatrixHandler:
    def __init__(self, n_users, n_items):
        self.X = np.random.random((n_users, n_items)) / 10**10
        self.n_users = n_users
        self.n_items = n_items

    def update_user_row(self, user_index, vals):
        self.X[user_index, :] = vals

    def update_item_column(self, item_index, vals):
        self.X[:, item_index] = vals

    def update_element(self, user_index, item_index, val):
        self.X[user_index, item_index] = val

class CollaborativeFiltering(MatrixHandler):
    def __init__(self, n_users, n_items, k=2, r=2):
        super().__init__(n_users, n_items)
        self.k = k
        self.r = r

    def get_top_k_similar(self, user_index):
        x = self.X[user_index, :].reshape(1,-1)
        U_norm = np.linalg.norm(self.X, axis=1).reshape(1,-1)
        U_norm[U_norm == 0] = 1


        cos_similarity = (x @ self.X.T).reshape(-1) / (U_norm).reshape(-1)
        top_k_similar = list(np.argsort(cos_similarity)[::-1])
        top_k_similar.pop(user_index)
        top_k_similar = np.array(top_k_similar[:self.k])
        return top_k_similar, cos_similarity[top_k_similar]

    def get_top_r_recommendations(self, user_index):
        top_k_similar, similarity = self.get_top_k_similar( user_index)
        est_sim = similarity.reshape(1, -1)  @ self.X[top_k_similar, :]
        est_sim = est_sim.reshape(-1) / similarity.sum()


        already_consumed = set(np.where(self.X[user_index] == 1)[0])
        top_r_items = [i for i in np.argsort(est_sim)[::-1] if i not in already_consumed]

        top_r_items = np.array(top_r_items[:self.r])

        return top_r_items

class Users(MatrixHandler):

    def __init__(self, n_users, n_items, list_alphas, list_betas, list_sizes, list_scales):
        super().__init__(n_users, n_items)
        self.list_alphas = []
        self.list_betas = []
        self.list_sizes = []
        x = np.arange(0, n_users, 1)

        item_index = 0
        for alpha, beta, scale, size in zip(list_alphas,
                                     list_betas,
                                     list_scales,
                                     list_sizes):
            vals = stats.betabinom(self.n_users-1, alpha, beta)

            for _ in range(size):
                self.update_item_column(item_index, vals.pmf(x) * scale)
                item_index += 1
        # plt.show()

    def interact(self, user_index, cfrs, selection_mode='utility'):
        recommendations = cfrs.get_top_r_recommendations(user_index)
        scores = self.X[user_index, recommendations] + np.finfo(float).eps
        scores = scores/scores.sum()
        if selection_mode == 'utility':
            choice = np.random.choice(recommendations, p=scores)

        else:
            choice = np.random.choice(recommendations)

        cfrs.update_element(user_index, choice, 1)

        return scores, recommendations, choice


def burn_in(M, S, z=20, selection_mode='utility'):
    rv = stats.poisson(z)
    tosses = enumerate(rv.rvs(M.n_users))
    iterator_ = np.array(list(itertools.chain.from_iterable(
        itertools.repeat(user_index, repeats) for user_index, repeats in enumerate(rv.rvs(M.n_users))
    )))
    np.random.shuffle(iterator_)

    for user_index in iterator_:
        M.interact(user_index, S, selection_mode=selection_mode)

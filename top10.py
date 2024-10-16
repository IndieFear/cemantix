from gensim.models import KeyedVectors

# Charger le modèle en format binaire Word2Vec
model_path = "/Users/stanislasperidy/Desktop/Cemantix/frWac_no_postag_no_phrase_500_skip_cut100.bin"
model = KeyedVectors.load_word2vec_format(model_path, binary=True)

# Fonction pour trouver les 10 mots les plus proches
def find_closest_words(word):
    try:
        closest_words = model.most_similar(word, topn=10)
        print(f"Les 10 mots les plus proches de '{word}' sont :")
        for similar_word, similarity in closest_words:
            print(f"{similar_word} (similarité: {similarity:.4f})")
    except KeyError as e:
        print(f"Mot non trouvé dans le modèle : {e}")

# Exemple de test
if __name__ == "__main__":
    word = input("Entrez un mot : ")
    find_closest_words(word)

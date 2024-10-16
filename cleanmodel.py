from gensim.models import KeyedVectors
import spacy

# Charger le modèle Word2Vec existant
model_path = "/Users/stanislasperidy/Desktop/Cemantix/frWac_no_postag_no_phrase_500_skip_cut100.bin"
model = KeyedVectors.load_word2vec_format(model_path, binary=True)

# Charger le modèle linguistique spaCy pour le français
nlp = spacy.load("fr_core_news_sm")

# Fonction pour filtrer les mots
def is_plural_or_feminine(word):
    # Utiliser spaCy pour analyser le mot
    doc = nlp(word)
    for token in doc:
        # Vérifie si le mot est un pluriel ou féminin
        if token.tag_ in ['NOUN', 'ADJ']:  # Se concentre sur les noms et adjectifs
            if token.morph.get('Number') == ['Plur']:
                return True  # C'est un pluriel
            if token.morph.get('Gender') == ['Fem']:
                return True  # C'est féminin
    return False  # Ni pluriel ni féminin

# Créer une nouvelle liste de mots
filtered_words = {}
for word in model.key_to_index:
    if not is_plural_or_feminine(word):
        filtered_words[word] = model[word]  # Conserver le vecteur associé

# Créer un nouveau modèle KeyedVectors
new_model = KeyedVectors(vector_size=model.vector_size)
new_model.add_vectors(list(filtered_words.keys()), list(filtered_words.values()))

# Sauvegarder le nouveau modèle
new_model_path = "filtered_model.bin"
new_model.save_word2vec_format(new_model_path, binary=True)

print(f"Nouveau modèle sauvegardé à : {new_model_path}")

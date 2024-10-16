from flask import Flask, request, jsonify
from gensim.models import KeyedVectors

app = Flask(__name__)

# Chemin vers le fichier du modèle
model_path = "/Users/stanislasperidy/Desktop/Cemantix/frWac_no_postag_no_phrase_500_skip_cut100.bin"

# Chargement du modèle
try:
    model = KeyedVectors.load(model_path)
except Exception as e:
    print(f"Erreur lors du chargement du modèle : {e}")
    # Essaye de le charger au format Word2Vec
    try:
        model = KeyedVectors.load_word2vec_format(model_path, binary=True)
    except Exception as e:
        print(f"Erreur lors du chargement du modèle au format Word2Vec : {e}")

@app.route('/similarity', methods=['POST'])
def similarity():
    # Obtenir les données JSON envoyées dans la requête
    data = request.get_json()
    word1 = data.get('word1')
    word2 = data.get('word2')

    try:
        # Calculer la similarité entre les deux mots
        sim = model.similarity(word1, word2)
        return jsonify({'similarity': sim})
    except KeyError:
        return jsonify({'error': 'Un ou plusieurs mots non trouvés dans le modèle.'}), 404

if __name__ == '__main__':
    app.run(debug=True)

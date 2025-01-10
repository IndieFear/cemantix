from flask import Flask, request, jsonify
from flask_cors import CORS
from gensim.models import KeyedVectors

app = Flask(__name__)
CORS(app)  # Autoriser toutes les origines

# Chemin vers le fichier du modèle
model_path = "/Users/stanislasperidy/Desktop/Cemantix/frWac_no_postag_no_phrase_500_skip_cut100.bin"
model = KeyedVectors.load_word2vec_format(model_path, binary=True)

# Calculer les 1000 mots les plus proches une fois au démarrage
target_word = 'animal'
top_1000_words = model.most_similar(target_word, topn=1000)

@app.route('/similarity', methods=['POST'])
def similarity():
    # Obtenir les données JSON envoyées dans la requête
    data = request.get_json()
    word1 = data.get('word1')
    word2 = data.get('word2')

    try:
        # Calculer la similarité entre les deux mots
        sim = model.similarity(word1, word2)
        position = next((index + 1 for index, (word, _) in enumerate(top_1000_words) if word == word1), None)

        return jsonify({'similarity': float(sim), 'position': position})
    except KeyError:
        return jsonify({'error': 'Un ou plusieurs mots non trouvés dans le modèle.'}), 404

if __name__ == '__main__':
    app.run(debug=True)

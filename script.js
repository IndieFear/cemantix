const wordForm = document.getElementById('word-form');
const wordInput = document.getElementById('word-input');
const resultsTable = document.getElementById('results-body');
const message = document.getElementById('message');

const targetWord = 'animal';  // Mot à deviner
let wordCount = 0;
let wordsList = [];
let lastEnteredWord = '';

// Fonction pour ajouter un mot dans le tableau
function addWordToTable(word, similarity, position) {
    wordCount++;
    
    // Ajouter à la liste des mots
    wordsList.push({ word, similarity, count: wordCount, position });

    // Trier par similarité décroissante
    const sortedWords = wordsList.slice().sort((a, b) => b.similarity - a.similarity);

    // Réinitialiser le tableau
    resultsTable.innerHTML = '';

    // Afficher le dernier mot entré en gras
    if (lastEnteredWord) {
        const row = createTableRow(lastEnteredWord, similarity, wordCount, position, true);
        resultsTable.appendChild(row);
    }

    // Afficher les autres mots triés
    sortedWords.forEach((item) => {
        if (item.word !== lastEnteredWord) {
            const row = createTableRow(item.word, item.similarity, item.count, item.position, false);
            resultsTable.appendChild(row);
        }
    });
}

// Fonction pour créer une ligne de tableau
function createTableRow(word, similarity, count, position, isBold, isNewWord) {
    const row = document.createElement('tr');

    const numberCell = document.createElement('td');
    numberCell.textContent = count;

    const wordCell = document.createElement('td');
    wordCell.textContent = word;

    const similarityCell = document.createElement('td');
    similarityCell.textContent = similarity.toFixed(2);

    const progressionCell = document.createElement('td');
    const icon = similarity > 0 ? '🔥' : '❄️';
    progressionCell.textContent = icon;

    // Colonne pour la barre de progression
    const progressCell = document.createElement('td');
    if (position !== null) {
        // Créer un conteneur pour la barre de progression et la valeur numérique
        const progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');

        // Créer la barre de progression
        const progress = document.createElement('progress');
        progress.value = 1001 - position;  // Fixer à la position directement pour les anciens mots
        progress.max = 1000;

        // Créer le span pour afficher la valeur de la position
        const progressValue = document.createElement('span');
        progressValue.classList.add('progress-value');
        progressValue.textContent = (1001 - position);  // Afficher la valeur

        // Ajouter la barre de progression et le texte au conteneur
        progressContainer.appendChild(progress);
        progressContainer.appendChild(progressValue);

        // Ajouter le conteneur dans la cellule du tableau
        progressCell.appendChild(progressContainer);

        // Lancer l'animation uniquement pour le nouveau mot
        if (isNewWord) {
            progress.value = 0;  // Commencer l'animation à 0 seulement pour le nouveau mot
            animateProgress(progress, 1001 - position);  // Inverser la progression
        }
    } else {
        progressCell.textContent = '-';
    }

    row.appendChild(numberCell);
    row.appendChild(wordCell);
    row.appendChild(similarityCell);
    row.appendChild(progressionCell);
    row.appendChild(progressCell);

    if (isBold) {
        row.style.fontWeight = 'bold';
    }

    return row;
}


// Fonction pour animer la barre de progression
function animateProgress(progressElement, targetValue) {
    const currentValue = progressElement.value;
    const increment = (targetValue - currentValue) / 50;  // Ajuste le nombre d'étapes pour la fluidité
    let currentStep = 0;

    function step() {
        currentStep++;
        progressElement.value = currentValue + increment * currentStep;

        if (currentStep < 50) {
            requestAnimationFrame(step);
        } else {
            progressElement.value = targetValue;  // Assure d'atteindre la valeur finale
        }
    }

    step();
}




// Fonction pour appeler l'API et obtenir la similarité et la position
function getSimilarity(word) {
    return fetch('http://127.0.0.1:5000/similarity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word1: word, word2: targetWord }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        return { similarity: data.similarity, position: data.position };
    })
    .catch(error => {
        console.error('Erreur:', error);
        return null;
    });
}

// Écouter la soumission du formulaire
wordForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const enteredWord = wordInput.value.trim();

    if (!enteredWord) return;

    lastEnteredWord = enteredWord;

    // Appeler l'API pour obtenir la similarité et la position
    getSimilarity(enteredWord).then(result => {
        if (result !== null) {
            addWordToTable(enteredWord, result.similarity, result.position);

            if (enteredWord.toLowerCase() === targetWord) {
                message.textContent = "Félicitations ! Vous avez trouvé le mot.";
            } else {
                message.textContent = '';
            }
        } else {
            message.textContent = 'Erreur lors de la récupération de la similarité.';
        }

        wordInput.value = '';
    });
});

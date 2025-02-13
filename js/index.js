document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1; // Track current page of monsters
    const monstersPerPage = 10; // Display 10 monsters per page

    // Load initial monsters on page load
    loadMonsters(currentPage);

    // Event listener for form submission to create a new monster
    const monsterForm = document.getElementById("monster-form");
    monsterForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const description = document.getElementById("description").value;

        createMonster(name, age, description);
    });

    // Event listener for "back" button to navigate to previous page
    const backButton = document.getElementById("back");
    backButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadMonsters(currentPage);
        }
    });

    // Event listener for "forward" button to navigate to next page
    const forwardButton = document.getElementById("forward");
    forwardButton.addEventListener("click", () => {
        currentPage++;
        loadMonsters(currentPage);
    });

    // Function to fetch and display monsters from API
    function loadMonsters(page) {
        fetch(`http://localhost:3000/monsters/?_limit=${monstersPerPage}&_page=${page}`)
            .then(response => response.json())
            .then(data => {
                const monsterContainer = document.getElementById("monster-container");
                monsterContainer.innerHTML = ""; // Clear previous monsters

                data.forEach(monster => {
                    const monsterDiv = document.createElement("div");
                    monsterDiv.classList.add("monster");
                    monsterDiv.innerHTML = `
                        <h3>${monster.name}</h3>
                        <p>Age: ${monster.age}</p>
                        <p>Description: ${monster.description}</p>
                    `;
                    monsterContainer.appendChild(monsterDiv);
                });
            })
            .catch(error => console.error("Error loading monsters:", error));
    }

    // Function to create a new monster via POST request
    function createMonster(name, age, description) {
        const newMonster = {
            name: name,
            age: age,
            description: description
        };

        fetch("http://localhost:3000/monsters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newMonster)
        })
        .then(response => response.json())
        .then(() => {
            // Reload monsters after adding a new one
            loadMonsters(currentPage);
            // Reset form inputs after successful creation
            monsterForm.reset();
        })
        .catch(error => console.error("Error creating monster:", error));
    }
});

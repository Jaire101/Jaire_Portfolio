const workoutForm = document.getElementById("workoutForm");
const workoutList = document.getElementById("workoutList");

const totalWorkouts = document.getElementById("totalWorkouts");
const totalSets = document.getElementById("totalSets");
const totalVolume = document.getElementById("totalVolume");

const clearAllButton = document.getElementById("clearAllButton");
const workoutFilter = document.getElementById("workoutFilter");

let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

renderWorkouts();

workoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const exercise = document.getElementById("exercise").value;
  const sets = document.getElementById("sets").value;
  const reps = document.getElementById("reps").value;
  const weight = document.getElementById("weight").value;

  const workout = {
    exercise,
    sets,
    reps,
    weight
  };

  workouts.push(workout);

  saveWorkouts();
  renderWorkouts();

  workoutForm.reset();

  document.getElementById("exercise").focus();
});

clearAllButton.addEventListener("click", () => {
  const userConfirmed = confirm(
    "Are you sure you want to delete all workouts?"
  );

  if (!userConfirmed) {
    return;
  }

  workouts = [];

  saveWorkouts();
  renderWorkouts();
});

workoutFilter.addEventListener("input", () => {
  renderWorkouts();
});

function saveWorkouts() {
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

function renderWorkouts() {
  const searchTerm = workoutFilter.value.toLowerCase().trim();

  const filteredWorkouts = workouts.filter((workout) => {
    return workout.exercise.toLowerCase().includes(searchTerm);
  });

  workoutList.innerHTML = "";

  if (filteredWorkouts.length === 0) {
    workoutList.innerHTML = `
      <p class="empty-message">
        No matching workouts found.
      </p>
    `;

    updateSummary();
    return;
  }

  filteredWorkouts.forEach((workout) => {
    const originalIndex = workouts.indexOf(workout);

    const workoutItem = document.createElement("article");
    workoutItem.classList.add("workout-item");

    const workoutDetails = document.createElement("div");

    const exerciseName = document.createElement("h3");
    exerciseName.textContent = workout.exercise;

    const workoutInfo = document.createElement("p");
    workoutInfo.textContent =
      `${workout.sets} sets × ${workout.reps} reps at ${workout.weight} lbs`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
      workouts.splice(originalIndex, 1);

      saveWorkouts();
      renderWorkouts();
    });

    workoutDetails.append(exerciseName, workoutInfo);

    workoutItem.append(workoutDetails, deleteButton);

    workoutList.append(workoutItem);
  });

  updateSummary();
}

function updateSummary() {
  const workoutCount = workouts.length;

  const setsCount = workouts.reduce((total, workout) => {
    return total + Number(workout.sets);
  }, 0);

  const volume = workouts.reduce((total, workout) => {
    return total + (
      Number(workout.sets) *
      Number(workout.reps) *
      Number(workout.weight)
    );
  }, 0);

  totalWorkouts.textContent = workoutCount;
  totalSets.textContent = setsCount;
  totalVolume.textContent = `${volume.toLocaleString()} lbs`;
}
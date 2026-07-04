const workoutForm = document.getElementById("workoutForm");
const workoutList = document.getElementById("workoutList");

const workouts = [];

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

  renderWorkouts();

  workoutForm.reset();

  document.getElementById("exercise").focus();
});

function renderWorkouts() {
  workoutList.innerHTML = "";

  if (workouts.length === 0) {
    workoutList.innerHTML = `
      <p class="empty-message">
        No workouts added yet.
      </p>
    `;

    return;
  }

  workouts.forEach((workout) => {
    const workoutItem = document.createElement("article");

    workoutItem.classList.add("workout-item");

    const workoutDetails = document.createElement("div");

    const exerciseName = document.createElement("h3");
    exerciseName.textContent = workout.exercise;

    const workoutInfo = document.createElement("p");
    workoutInfo.textContent =
      `${workout.sets} sets × ${workout.reps} reps at ${workout.weight} lbs`;

    workoutDetails.append(exerciseName, workoutInfo);

    workoutItem.append(workoutDetails);

    workoutList.append(workoutItem);
  });
}
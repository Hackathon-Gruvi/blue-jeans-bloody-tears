module.exports.runtime_2_min = (runtime) => {
  let times = runtime.split(" ");
  let minutes = 0;

  times.forEach((time) => {
    if (time.includes("h")) {
      minutes += 60 * parseInt(time.replaceAll("h", ""));
    } else if (time.includes("min")) {
      minutes += parseInt(time.replaceAll("min", ""));
    }
  });

  return minutes;
};

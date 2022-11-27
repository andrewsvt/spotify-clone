export function msToTime(ms: number | undefined) {
  if (ms) {
    const minutes : number = Math.floor(ms / 60000);
    const seconds : string = ((ms % 60000) / 1000).toFixed(0);
    return Number(seconds) == 60 ? minutes + 1 + ':00' : minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  } else return ms;
}
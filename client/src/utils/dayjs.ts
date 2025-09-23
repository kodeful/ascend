import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// Import locales
import "dayjs/locale/en";
import "dayjs/locale/es";

// declare module "dayjs" {
//   interface Dayjs {}
// }

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;

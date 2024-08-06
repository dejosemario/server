import SendResponse  from "../utils/sendResponse";

export default class BaseController  extends SendResponse {
  constructor() {
    super();
  }
  protected validate(schema: any, data: any) {
    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message.replace(/["]/g, "");
    }
    return null;
  }
}

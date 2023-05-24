
import { KavenegarApi } from "kavenegar";
import env from './env.js';
import smsHistory from '../models/smsHistory.model.js'
class Kavenegar {
  smsMessage;
  smsReceptors;

  api;
  sender;
  kavenegarResponse;
  user;

  constructor(user) {
    this.user = user;
    this.api = KavenegarApi({
      apikey: env('KAVENEGAR_APIKEY'),
    });
    this.sender = env('KAVENEGAR_SENDER');
  }

  static builder(user) {
    return new Kavenegar(user);
  }

  message(message) {
    this.smsMessage = message;
    return this;
  }

  receptor(receptor) {
    this.smsReceptors = receptor;
    return this;
  }

  async send() {
    const payload = {
      message: this.smsMessage,
      sender: this.sender,
      receptor: this.smsReceptors,
    };

    this.kavenegarResponse = await new Promise((resolve, reject) => {
      this.api.Send(payload, (response, status) => {
        resolve({ response, status });
      });
    });

    await smsHistory.create({
      user_id: this.user._id,
      step: 'verification',
      provider: 'kavehnegar',
      sender: this.sender,
      receiver: this.smsReceptors,
      status: this.kavenegarResponse["status"],
      respone: this.kavenegarResponse.toString()
    });
    
    return (
      typeof this.kavenegarResponse["status"] != "undefined" &&
      this.kavenegarResponse["status"] == 200
    );
  }
}

export default Kavenegar;

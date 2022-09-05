import { SignInResponse, SignUpResponse, User } from '../../types/types';
import Api from '../models/Api';
import Authorization from '../views/Authorisation';

export default class AuthorizationControllers {
  authorization: Authorization;

  api: Api;

  constructor() {
    this.authorization = new Authorization();
    this.api = new Api();
  }

  public enableAuthorization(): void {
    this.listenSignInBtn();
    this.listenSignUpHeaderBtn();
  }

  private listenSignInBtn(): void {
    const signInBtn: HTMLButtonElement = document.querySelector('.btn_login')!;
    signInBtn.addEventListener('click', (): void => {
      const modal: HTMLDivElement = document.querySelector('.modal');
      if (!modal) {
        this.authorization.renderSignIn();
        this.addListenersToModal();
      } else if (modal.dataset.modal === 'signup') {
        modal.remove();
        this.authorization.renderSignIn();
        this.addListenersToModal();
      } else {
        document.body.style.overflow = 'hidden';
        this.clearModalInputs(['email-signin', 'password-signin']);
        this.clearModalMessages();
        modal.classList.toggle('modal_hide');
      }
    });
  }

  private addListenersToModal(): void {
    this.listenCloseModalBtn();
    this.listenModal();
    this.listenModalSwitchToSignUpBtn();
    this.listenModalSignInBtn();
  }

  private listenSignUpHeaderBtn(): void {
    const signUpHeaderBtn: HTMLButtonElement = document.querySelector('.btn_logout');
    const headerBtnSignIn: HTMLButtonElement = document.querySelector('.btn_login');
    const logoutBtn: HTMLButtonElement = document.querySelector('.btn_logout');
    signUpHeaderBtn.addEventListener('click', (): void => {
      headerBtnSignIn.classList.toggle('btn_hide');
      logoutBtn.classList.toggle('btn_hide');
      this.deleteKeysWithDataInLocalStorage(['rslang-user', 'progress']);
    });
  }

  private listenModalSwitchToSignUpBtn(): void {
    const signUpBtn: HTMLButtonElement = document.querySelector("[data-authorization='signup']")!;
    const modal: HTMLDivElement = document.querySelector('.modal')!;
    signUpBtn.addEventListener('click', (): void => {
      modal.remove();
      this.authorization.renderSignUp();
      this.listenCloseModalBtn();
      this.listenModal();
      this.listenModalSignUpBtn();
    });
  }

  private listenModalSignUpBtn(): void {
    const signUpBtn: HTMLButtonElement = document.querySelector("[data-authorization='create-account']")!;
    signUpBtn.addEventListener('click', (): void => {
      this.authentication('signup');
    });
  }

  private listenCloseModalBtn(): void {
    const crossBtn: HTMLButtonElement = document.querySelector('.modal__exit')!;
    const modal: HTMLDivElement = document.querySelector('.modal')!;
    crossBtn.addEventListener('click', (): void => {
      modal.classList.toggle('modal_hide');
      document.body.style.overflow = '';
    });
  }

  private listenModal(): void {
    const modal: HTMLDivElement = document.querySelector('.modal')!;
    modal.addEventListener('click', (event: Event): void => {
      if (event.target === event.currentTarget) {
        modal.classList.toggle('modal_hide');
        document.body.style.overflow = '';
      }
    });
  }

  private listenModalSignInBtn(): void {
    const signInBtn: HTMLButtonElement = document.querySelector("[data-authorization='signin']")!;
    signInBtn.addEventListener('click', (): void => {
      this.authentication('signin');
    });
  }

  private async authentication(type: string): Promise<void> {
    const dataFromInputs = this.getDataFromInputs(type);
    let responseSignUp: SignUpResponse;
    let responseSignIn: SignInResponse;
    switch (type) {
      case 'signin':
        responseSignIn = await this.api.signIn(dataFromInputs);
        if (responseSignIn.message.includes('Authenticated')) {
          this.changeStateAfterAuthentication();
          this.setUserAndProgressToLocalStorage(responseSignIn);
        } else {
          this.messagesObserver(responseSignIn);
        }
        break;
      case 'signup':
        responseSignUp = await this.api.createUser(dataFromInputs);
        responseSignIn = await this.api.signIn(dataFromInputs);
        if (!Object.prototype.hasOwnProperty.call(responseSignUp, 'message') && responseSignIn.message.includes('Authenticated')) {
          this.changeStateAfterAuthentication();
          this.setUserAndProgressToLocalStorage(responseSignIn);
        } else {
          this.messagesObserver(responseSignUp);
        }
        break;
      default:
        break;
    }
  }

  private changeStateAfterAuthentication(): void {
    const modal: HTMLDivElement = document.querySelector('.modal')!;
    const headerBtnSignIn: HTMLButtonElement = document.querySelector('.btn_login');
    const logoutBtn: HTMLButtonElement = document.querySelector('.btn_logout');
    modal.classList.toggle('modal_hide');
    headerBtnSignIn.classList.toggle('btn_hide');
    logoutBtn.classList.toggle('btn_hide');
    modal.remove();
    document.body.style.overflow = '';
  }

  private getDataFromInputs(type: string): User | undefined {
    let name: HTMLInputElement;
    const email: HTMLInputElement = document.querySelector(`[data-input="email-${type}"]`);
    const password: HTMLInputElement = document.querySelector(`[data-input="password-${type}"]`);
    if (type === 'signin') {
      return {
        email: email.value,
        password: password.value,
      };
    }
    if (type === 'signup') {
      name = document.querySelector(`[data-input="name-${type}"]`);
      return {
        name: name.value,
        email: email.value,
        password: password.value,
      };
    }
    return undefined;
  }

  private setUserAndProgressToLocalStorage(user: SignInResponse): void {
    const progress = {};
    localStorage.setItem('progress', JSON.stringify(progress));
    localStorage.setItem('rslang-user', JSON.stringify(user));
  }

  public checkUserInLocalStorage(): boolean {
    const user = localStorage.getItem('rslang-user');
    return !!user;
  }

  private deleteKeysWithDataInLocalStorage(keys: string[]): void {
    keys.forEach((key: string) => {
      switch (key) {
        case 'rslang-user':
          localStorage.removeItem('rslang-user');
          break;
        case 'progress':
          localStorage.removeItem('progress');
          break;
        default:
          break;
      }
    });
    window.location.reload();
  }

  private clearModalInputs(datasets: string[]): void {
    datasets.forEach((dataset) => {
      const input: HTMLInputElement = document.querySelector(`[data-input='${dataset}`);
      input.value = '';
    });
  }

  private clearModalMessages(): void {
    const modalMessages: HTMLDivElement = document.querySelector('.modal__messages');
    if (modalMessages) {
      modalMessages.remove();
    }
  }

  private messagesObserver(response: SignInResponse | SignUpResponse): void {
    const modalFluid: HTMLDivElement = document.querySelector('.modal__fluid');
    const modalMessagesExists: HTMLDivElement = document.querySelector('.modal__messages');
    if (modalMessagesExists) {
      modalMessagesExists.remove();
    }
    const modalMessages: HTMLDivElement = document.createElement('div');
    modalMessages.classList.add('modal__messages');
    if (typeof response.message === 'string') {
      modalMessages.innerHTML = `${response.message}<br>`;
    } else {
      response.message.forEach((message: string) => {
        modalMessages.innerHTML += `${message}<br>`;
      });
    }
    modalFluid.append(modalMessages);
  }

  public getUserFromLocalStorage(): User {
    const user: User = JSON.parse(localStorage.getItem('rslang-user'));
    return user;
  }
}

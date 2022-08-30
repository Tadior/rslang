// eslint-disable-next-line object-curly-newline
import { User, SignInResponse, NewUser, SignUpResponse } from '../../types/types';
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
        this.listenCloseModalBtn();
        this.listenModal();
        this.listenModalSwitchToSignUpBtn();
        this.listenModalSignInBtn();
      } else if (modal.dataset.modal === 'signup') {
        document.querySelector('.modal')!.remove();
        this.authorization.renderSignIn();
        this.listenCloseModalBtn();
        this.listenModal();
        this.listenModalSwitchToSignUpBtn();
        this.listenModalSignInBtn();
      } else {
        document.body.style.overflow = 'hidden';
        this.clearModalInputs(['email-signin', 'password-signin']);
        this.clearModalMessages();
        modal.classList.toggle('modal_hide');
      }
    });
  }

  private listenSignUpHeaderBtn(): void {
    const signUpHeaderBtn: HTMLButtonElement = document.querySelector('.btn_logout');
    const headerBtnSignIn: HTMLButtonElement = document.querySelector('.btn_login');
    const logoutBtn: HTMLButtonElement = document.querySelector('.btn_logout');
    signUpHeaderBtn.addEventListener('click', (): void => {
      headerBtnSignIn.classList.toggle('btn_hide');
      logoutBtn.classList.toggle('btn_hide');
      this.clearUserInLocalStorage();
      this.clearProgressInLocalStorage();
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
      this.signUp();
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
    signInBtn.addEventListener('click', () => {
      this.signIn();
    });
  }

  private async signIn(): Promise<void> {
    const email: HTMLInputElement = document.querySelector('[data-input="email-signin"]');
    const password: HTMLInputElement = document.querySelector('[data-input="password-signin"]');
    const user: User = {
      email: email.value,
      password: password.value,
    };
    const response: SignInResponse = await this.api.signIn(user);
    const modal: HTMLDivElement = document.querySelector('.modal')!;
    const headerBtnSignIn: HTMLButtonElement = document.querySelector('.btn_login');
    const logoutBtn: HTMLButtonElement = document.querySelector('.btn_logout');
    if (response.message.includes('Authenticated')) {
      modal.classList.toggle('modal_hide');
      headerBtnSignIn.classList.toggle('btn_hide');
      logoutBtn.classList.toggle('btn_hide');
      modal.remove();
      document.body.style.overflow = '';
      this.setUserToLocalStorage(response);
      this.createProgressStorage();
    } else {
      this.messagesObserver(response);
    }
  }

  private async signUp(): Promise<void> {
    const email: HTMLInputElement = document.querySelector('[data-input="email-signup"]');
    const name: HTMLInputElement = document.querySelector('[data-input="name-signup"]');
    const password: HTMLInputElement = document.querySelector('[data-input="password-signup"]');
    const newUser: NewUser = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    const responseSignUp: SignUpResponse = await this.api.createUser(newUser);
    const responseSignIn: SignInResponse = await this.api.signIn(newUser);
    const modal: HTMLDivElement = document.querySelector('.modal')!;
    const headerBtnSignIn: HTMLButtonElement = document.querySelector('.btn_login');
    const logoutBtn: HTMLButtonElement = document.querySelector('.btn_logout');
    if (!Object.prototype.hasOwnProperty.call(responseSignUp, 'message') && responseSignIn.message.includes('Authenticated')) {
      modal.classList.toggle('modal_hide');
      headerBtnSignIn.classList.toggle('btn_hide');
      logoutBtn.classList.toggle('btn_hide');
      modal.remove();
      document.body.style.overflow = '';
      this.setUserToLocalStorage(responseSignIn);
      this.createProgressStorage();
    } else {
      this.messagesObserver(responseSignUp);
    }
  }

  private setUserToLocalStorage(user: SignInResponse): void {
    localStorage.setItem('rslang-user', JSON.stringify(user));
  }

  public checkUserInLocalStorage(): boolean {
    const user = localStorage.getItem('rslang-user');
    return !!user;
  }

  private createProgressStorage(): void {
    const progress = {};
    localStorage.setItem('progress', JSON.stringify(progress));
  }

  private clearUserInLocalStorage(): void {
    localStorage.removeItem('rslang-user');
  }

  private clearProgressInLocalStorage(): void {
    localStorage.removeItem('progress');
  }

  private clearModalInputs(datasets: string[]): void {
    datasets.forEach((dataset) => {
      const input: HTMLInputElement = document.querySelector(`[data-input='${dataset}`);
      input.value = '';
    });
  }

  private clearModalMessages(): void {
    const modalMessages = document.querySelector('.modal__messages');
    if (modalMessages) {
      modalMessages.remove();
    }
  }

  private messagesObserver(response: SignInResponse | SignUpResponse): void {
    const modalFluid = document.querySelector('.modal__fluid');
    const modalMessagesExists = document.querySelector('.modal__messages');
    if (modalMessagesExists) {
      modalMessagesExists.remove();
    }
    const modalMessages = document.createElement('div');
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
}

import soundIcon from '../../assets/img/sprint/sound_icon.png';
import fullscreenIcon from '../../assets/img/sprint/fullscreen_icon.png';
import robot from '../../assets/img/sprint/sprint_robot.png';

export default class SprintPage {
  renderSprintPage() {
    const sprintPage = document.createElement('section');
    sprintPage.classList.add('sprint');
    sprintPage.innerHTML = `
      <div class='container'>
        <div class='sprint__wrapper'>
          <div class='sprint__header'>
            <h4 class='title title_sprint'>Спринт</h4>
            <div class='header__icons'>
              <div class='minigame__sound'>
                <img src='${soundIcon}' alt='sound-icon'>
              </div>
              <div class='minigame__fullscreen'>
                <img src='${fullscreenIcon}' alt='fullscreen-icon'>
              </div>
            </div>
          </div>
          <div class='sprint__interface'>
            <div class='sprint__points'>
              <div class='points__current'>10</div>
              <div class='points__category'>+ 10 баллов</div>
              <div class='points__row'>
                <div class='row__cube_active'></div>
                <div class='row__cube'></div>
                <div class='row__cube'></div>
              </div>
            </div>
            <div class='sprint__console'>
              <div class='console__robot'>
                <img src='${robot}' alt='robot'>
              </div>
              <div class='console__wrapper'>
                <div class='console__word'>
                  <div class='console__english'>breakfast</div>
                  <div class='console__russian'>завтрак</div>
                </div>
                <div class='console__answer'>
                  <button class='btn btn_wrong'>❮ Неверно</button>
                  <button class='btn btn_right'>Верно ❯</button>
                </div>
              </div>
            </div>
            <div class='sprint__timer'></div>
          </div>
        <div>
      </div>
    `;
    (<HTMLElement>document.querySelector('main')).append(sprintPage);
    this.addSprintTimer();
    const footer = document.querySelector('footer');
    footer.parentElement.remove();
  }

  addSprintTimer() {
    const timer = document.querySelector('.sprint__timer');
    const timerHTML = `
      <div class='timer__line'></div>
      <div class='timer__body'>
        <div class='timer__counter'>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
          <span>12</span>
          <span>14</span>
          <span>15</span>
          <span>16</span>
          <span>17</span>
          <span>18</span>
          <span>19</span>
          <span>20</span>
          <span>21</span>
          <span>22</span>
          <span>23</span>
          <span>24</span>
          <span>25</span>
          <span>26</span>
          <span>27</span>
          <span>28</span>
          <span>29</span>
          <span>30</span>
          <span>31</span>
          <span>32</span>
          <span>33</span>
          <span>34</span>
          <span>35</span>
          <span>36</span>
          <span>37</span>
          <span>38</span>
          <span>39</span>
          <span>40</span>
          <span>41</span>
          <span>42</span>
          <span>43</span>
          <span>44</span>
          <span>45</span>
          <span>46</span>
          <span>47</span>
          <span>48</span>
          <span>49</span>
          <span>50</span>
          <span>51</span>
          <span>52</span>
          <span>53</span>
          <span>54</span>
          <span>55</span>
          <span>56</span>
          <span>57</span>
          <span>58</span>
          <span>59</span>
          <span>60</span>
        </div>
      </div>
    `;
    timer.insertAdjacentHTML('afterbegin', timerHTML);
  }
}

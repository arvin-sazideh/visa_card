import React, { useState, useEffect, useRef } from "react";
import '../views/page3.scss'; // Assuming you have a corresponding CSS file

const Page3 = () => {
  const [currentCardBackground, setCurrentCardBackground] = useState(Math.floor(Math.random() * 25 + 1));
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [minCardYear] = useState(new Date().getFullYear());
  const [amexCardMask] = useState("#### #### #### ####");
  const [otherCardMask] = useState("#### #### #### ####");
  const [cardNumberTemp, setCardNumberTemp] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [focusElementStyle, setFocusElementStyle] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const focusElementRef = useRef(null);
  const cardNumberRef = useRef(null);
  const cardNameRef = useRef(null);
  const cardDateRef = useRef(null);
  const cursorPositionRef = useRef(0);

  useEffect(() => {
    setCardNumberTemp(otherCardMask);
    cardNumberRef.current.focus();
  }, [otherCardMask]);

  const getCardType = () => {
    let number = cardNumber;
    let re = new RegExp("^4");
    if (number.match(re) != null) return "visa";

    re = new RegExp("^(34|37)");
    if (number.match(re) != null) return "amex";

    re = new RegExp("^5[1-5]");
    if (number.match(re) != null) return "mastercard";

    re = new RegExp("^6011");
    if (number.match(re) != null) return "discover";

    re = new RegExp("^9792");
    if (number.match(re) != null) return "troy";

    return "visa"; // default type
  };

  const generateCardNumberMask = () => {
    return getCardType() === "amex" ? amexCardMask : otherCardMask;
  };

  const minCardMonth = () => {
    if (cardYear === minCardYear) return new Date().getMonth() + 1;
    return 1;
  };

  useEffect(() => {
    if (cardMonth < minCardMonth()) {
      setCardMonth("");
    }
  }, [cardYear]);

  const flipCard = (status) => {
    setIsCardFlipped(status);
  };

  const focusInput = (e) => {
    setIsInputFocused(true);
    let targetRef = e.target.dataset.ref;
    let target = document.querySelector(`[data-ref="${targetRef}"]`);
    setFocusElementStyle({
      width: `${target.offsetWidth}px`,
      height: `${target.offsetHeight}px`,
      transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
    });
  };

  const blurInput = () => {
    setTimeout(() => {
      if (!isInputFocused) {
        setFocusElementStyle(null);
      }
    }, 300);
    setIsInputFocused(false);
  };

  const handleCardNumberChange = (e) => {
    const { value, selectionStart } = e.target;
    cursorPositionRef.current = selectionStart;
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
  };

  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\D+/g, "");
    const parts = cleanedValue.match(/.{1,4}/g);
    if (parts) {
      return parts.join(" ");
    }
    return cleanedValue;
  };

  useEffect(() => {
    const input = cardNumberRef.current;
    if (input && input.setSelectionRange) {
      input.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
    }
  }, [cardNumber]);

  return (
    <div className="wrapper" id="app">
      <div className="card-form">
        <div className="card-list">
          <div className={`card-item ${isCardFlipped ? "-active" : ""}`}>
            <div className="card-item__side -front">
              <div className={`card-item__focus ${focusElementStyle ? "-active" : ""}`} style={focusElementStyle} ref={focusElementRef}></div>
              <div className="card-item__cover">
                <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${currentCardBackground}.jpeg`} className="card-item__bg" alt="Card background" />
              </div>
              <div className="card-item__wrapper">
                <div className="card-item__top">
                  <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" className="card-item__chip" alt="Card chip" />
                  <div className="card-item__type">
                    <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${getCardType()}.png`} className="card-item__typeImg" alt="Card type" />
                  </div>
                </div>
                <label htmlFor="cardNumber" className="card-item__number" data-ref="cardNumber">
                  {generateCardNumberMask().split('').map((n, index) => (
                    <span key={index} className={`card-item__numberItem ${n.trim() === '' ? '-active' : ''}`}>
                      {index > 4 && index < 15 && cardNumber.length > index && n.trim() !== '' ? '*' : (cardNumber.length > index ? cardNumber[index] : n)}
                    </span>
                  ))}
                </label>
                <div className="card-item__content">
                  <label htmlFor="cardName" className="card-item__info" ref={cardNameRef}>
                    <div className="card-item__holder">Card Holder</div>
                    <div className="card-item__name">
                      {cardName.length ? (
                        [...cardName.replace(/\s\s+/g, ' ')].map((n, index) => (
                          <span className="card-item__nameItem" key={index + 1}>{n}</span>
                        ))
                      ) : (
                        "name card"
                      )}
                    </div>
                  </label>
                  <div className="card-item__date" ref={cardDateRef}>
                    <label htmlFor="cardMonth" className="card-item__dateTitle">Expires</label>
                    <label htmlFor="cardMonth" className="card-item__dateItem">
                      {cardMonth ? cardMonth : "MM"}
                    </label>
                    /
                    <label htmlFor="cardYear" className="card-item__dateItem">
                      {cardYear ? String(cardYear).slice(2, 4) : "YY"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-item__side -back">
              <div className="card-item__cover">
                <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${currentCardBackground}.jpeg`} className="card-item__bg" alt="Card background" />
              </div>
              <div className="card-item__band"></div>
              <div className="card-item__cvv">
                <div className="card-item__cvvTitle">CVV</div>
                <div className="card-item__cvvBand">
                  {[...cardCvv].map((n, index) => (
                    <span key={index}>*</span>
                  ))}
                </div>
                <div className="card-item__type">
                  <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${getCardType()}.png`} className="card-item__typeImg" alt="Card type" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-form__inner">
          <div className="card-input">
            <label htmlFor="cardNumber" className="card-input__label">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              className="card-input__input"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength="19"
              data-ref="cardNumber"
              autoComplete="off"
              ref={cardNumberRef}
            />
          </div>
          <div className="card-input">
            <label htmlFor="cardName" className="card-input__label">Card Holder</label>
            <input
              type="text"
              id="cardName"
              className="card-input__input"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              onFocus={focusInput}
              onBlur={blurInput}
              data-ref="cardName"
              dir="auto" // اضافه کردن جهت به صورت خودکار برای پشتیبانی از زبان‌های راست به چپ
            />
          </div>
          <div className="card-input">
            <label htmlFor="cardMonth" className="card-input__label">Expiration Date</label>
            <div className="card-input__row">
              <select
                id="cardMonth"
                className="card-input__input -select"
                value={cardMonth}
                onChange={e => setCardMonth(e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
                data-ref="cardDate"
              >
                <option value="" disabled>Month</option>
                {[...Array(12).keys()].map(i => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                id="cardYear"
                className="card-input__input -select"
                value={cardYear}
                onChange={e => setCardYear(e.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
                data-ref="cardDate"
              >
                <option value="" disabled>Year</option>
                {[...Array(12).keys()].map(i => (
                  <option key={i} value={minCardYear + i}>{minCardYear + i}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-input">
            <label htmlFor="cardCvv" className="card-input__label">CVV</label>
            <input
              type="text"
              id="cardCvv"
              className="card-input__input"
              value={cardCvv}
              onChange={e => setCardCvv(e.target.value)}
              onFocus={() => flipCard(true)}
              onBlur={() => { flipCard(false); blurInput(); }}
              maxLength="4"
              autoComplete="off"
              data-ref="cardCvv"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page3;

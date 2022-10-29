import "./App.css";
import exchange from "./api/api";
import { CURRENCY, WALLETS } from "./constants/constant";
import { useEffect, useState } from "react";

function App() {
  const [activeFrom, setActiveFrom] = useState(0);
  const [activeTo, setActiveTo] = useState(0);
  const [wallet, setWallet] = useState(WALLETS);
  const [walletFrom, setwalletFrom] = useState();
  const [walletTo, setwalletTo] = useState();
  const [valueFrom, setValueFrom] = useState(0);
  const [valueTo, setValueTo] = useState(0);
  const [valueExchange, setValueExchange] = useState(1);
  const [disabledExchange, setDisableExchange] = useState(true);
  const [error, setError] = useState(false);

  const handleExchange = async (from, to, amount) => {
    setValueExchange("exchanging");

    const data = await exchange(from, to, amount);
    if (data) {
      setValueTo(data);
      setValueExchange(data / valueFrom);
    }
    return data;
  };

  const handleChangeValueFrom = (e) => {
    let value = e.target.value;
    setValueFrom(value);
    setValueTo(valueExchange * value);
    setDisableExchange(false);
    if (Number(value) > wallet[walletFrom.name]) {
      setError(true);
      setDisableExchange(true);
    } else setError(false);
  };
  const handleChangeValueTo = (e) => {
    let value = e.target.value;
    setValueTo(value);
    setValueFrom(value / valueExchange);
    setDisableExchange(false);
    if (Number(value) > wallet[walletTo.name]) {
      setError(true);
      setDisableExchange(true);
    } else setError(false);
  };

  useEffect(() => {
    if (walletFrom && walletTo && valueFrom) {
      handleExchange(walletFrom.name, walletTo.name, valueFrom);
    }
  }, [walletFrom, walletTo, valueFrom]);

  const handleValueWallet = () => {
    const newWallet = {
      ...wallet,
      [walletFrom.name]:
        Math.round((wallet[walletFrom.name] - valueFrom) * 1000) / 1000,
      [walletTo.name]:
        Math.round((wallet[walletTo.name] + valueTo) * 1000) / 1000,
    };
    setWallet(newWallet);
    setValueFrom(0);
    setValueTo(0);
    console.log(wallet);
    console.log(newWallet);
  };

  return (
    <div className="wrapper bg-gray-800 w-full h-screen flex flex-col justify-center items-center">
      <div className="container w-96 text-center">
        <div className="heading mb-6">
          <h1 className="text-white font-semibold text-2xl">
            Currency Exchange
          </h1>
        </div>
        <div className="first-modal bg-white p-5 w-full rounded-lg mb-6">
          <div className="btns flex justify-between">
            {CURRENCY.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setActiveFrom(btn.id);
                  setwalletFrom(btn);
                }}
                className={`border-indigo-500 rounded border-2 px-8 py-1  ${
                  activeFrom === btn.id
                    ? "text-white bg-indigo-500 "
                    : "text-indigo-500"
                }`}
              >
                {btn.name}
              </button>
            ))}
          </div>
          <div>
            {walletFrom ? (
              <>
                <div className="exchange flex items-center justify-between mt-6">
                  <div className="balance flex items-center justify-between font-medium">
                    <p>Balance: </p>
                    <p> {walletFrom.symbol}</p>
                    <p>{wallet[walletFrom.name]}</p>
                  </div>
                  -
                  <input
                    id="value1"
                    type="text"
                    className={`border px-4 py-2 outline-none  rounded w-28 h-10 ml-2 ${
                      error === true ? "border-red-400" : "border-gray-400"
                    }`}
                    value={valueFrom}
                    onChange={handleChangeValueFrom}
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-right text-xs mt-2">
                    exceeds balance
                  </p>
                )}
              </>
            ) : (
              <div className="w-full mt-4">
                <p className="text-gray-500 text-xl">Select ur currency</p>
              </div>
            )}
            <div className="input text-grey-600"></div>
          </div>
        </div>
        {walletFrom && walletTo && (
          <div className="value mt-6">
            <span className="border text-white px-4 py-1 border-white rounded-xl">
              {walletFrom.symbol}1 = {walletTo.symbol} {valueExchange}
            </span>
          </div>
        )}
        <div className="second-modal bg-white p-5 w-full rounded-lg mt-6">
          <div className="btns flex justify-between">
            {CURRENCY.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setActiveTo(btn.id);
                  setwalletTo(btn);
                }}
                className={`border-indigo-500 rounded border-2 px-8 py-1  ${
                  activeTo === btn.id
                    ? "text-white bg-indigo-500 "
                    : "text-indigo-500"
                }`}
              >
                {btn.name}
              </button>
            ))}
          </div>

          <div>
            {walletTo ? (
              <>
                <div className="exchange flex items-center justify-between mt-6">
                  <div className="balance flex items-center justify-between font-medium">
                    <p>Balance:</p>
                    <p>{walletTo.symbol}</p>
                    <p>{wallet[walletTo.name]}</p>
                  </div>
                  <div className="input text-grey-600">
                    +
                    <input
                      id="value2"
                      type="text"
                      className={`border px-4 py-2 outline-none  rounded w-28 h-10 ml-2 ${
                        error === true ? "border-red-400" : "border-gray-400"
                      }`}
                      value={valueTo}
                      onChange={handleChangeValueTo}
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-red-400 text-right text-xs mt-2">
                    exceeds balance
                  </p>
                )}
              </>
            ) : (
              <div className="w-full mt-4">
                <p className="text-gray-500 text-xl">Select ur currency</p>
              </div>
            )}
          </div>
        </div>

        <button
          id="exchange-btn"
          className={`exchange-btn w-full  rounded-lg text-white font-bold px-4 py-3 mt-6 outline-none ${
            !disabledExchange
              ? "bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleValueWallet}
          disabled={disabledExchange}
        >
          EXCHANGE
        </button>
      </div>
    </div>
  );
}

export default App;

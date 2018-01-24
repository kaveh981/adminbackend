import 'reflect-metadata';
import { Container } from 'inversify';
import { GenericRepository, IGenericRepository } from '../data-layer';
import { QueryBuilder, DataPopulator } from './lib/exporter';
import { Employees as Employee, Users as User } from '../model-layer';

import { container, SuiteHandler, DataSetup } from './lib/exporter';
async function test() {
    console.log('test started');
    let dataSetup = container.get<DataSetup>('DataSetup');
    const dataPopulator = container.get<DataPopulator>('DataPopulator');
    await dataPopulator.createEmployee();
    let repo = container.get<GenericRepository<any>>('GenericRepository')
    let emp = await repo.list(User, { relations: ['employee'] });
    console.log('empppppppp: ' + JSON.stringify(emp));
    let result: User = await repo.getSingle(User, {
        relations: ["employee"],
        where: {
            "userId": 1
        }
    });
    console.log('resultttttt: ' + JSON.stringify(result));
    //await console.log(JSON.stringify(dataSetup.testQuery()));
    //await dataSetup.backupTables();
    // await dataSetup.restoreTables();
    process.exit(0);
    //  await dataSetup.clearTables();
    // await dataSetup.restoreTables();
    // await container.get<GenericRepository<any>>("GenericRepository").closeConnection();
}

// test(); 

let sortedArray = [];
let shuffledArray = [];
let playerHand = [];
let hands = [];
let goneArray = [];
let numberOfPlayers = 1;
let players = [];
let dealerHand = [];
let minBit = 25;
let playersBank = [];
let playersRecord = [];
let playedHand = [];
let lastCounting = [];
let countingLimit = 300;
let matchBet = 5;
let playerBankMatches = [];
let blackjackFalctuation = [];
let sideBetFalctuation = [];
let totalFlactuation = [];
function generateCards() {
    print('***** generating cards');
    let i;
    for (i = 1; i <= 4; i++) {
        let j;
        for (j = 1; j <= 13; j++) {
            if (j != 10) {
                let k;
                // because we want 8 decks
                for (k = 0; k <= 7; k++) {
                    let value;
                    if (j === 1) {
                        value = 11;
                    } else if (j == 11 || j == 12 || j == 13) {
                        value = 10;
                    }
                    else {
                        value = j;
                    }
                    sortedArray.push({ 'number': j, 'value': value, 'kind': i })
                }
            }
        }
    }
    //  console.log(sortedArray.length + '-----' + JSON.stringify(sortedArray));
}

function shuffle() {
    generateCards();
    print('**** shuffling cards' + '\n');
    while (sortedArray.length > 0) {
        let ranNumber = Math.floor(Math.random() * (sortedArray.length));
        shuffledArray.push(sortedArray[ranNumber]);
        if (ranNumber > -1) {
            sortedArray.splice(ranNumber, 1);
        }
    }
    //  console.log(shuffledArray.length + '-----' + JSON.stringify(shuffledArray));
}
function isPair(playerCard, houseCard) {
    if (playerCard == 2 || playerCard == 3) {
        if (houseCard > 1 && houseCard < 9) {
            return 'p';
        }
        else
            return 'h';
    }
    if (playerCard == 6) {
        if (houseCard > 3 && houseCard < 7) {
            return 'p';
        }
        else
            return 'h';
    }
    if (playerCard == 7) {
        if (houseCard > 1 && houseCard < 7) {
            return 'p';
        }
        else if (houseCard == 7)
            return 'p$';
        else
            return 'h';
    }
    if (playerCard == 8) {
        return 'p';
    }
    if (playerCard == 9) {
        if (houseCard == 2 || houseCard == 7 || (houseCard > 10 && houseCard < 14))
            return 's';
        else
            return 'p';
    }
    if (playerCard == 11) {
        return 'p';
    }
    else return 'f';
}

function getBasicStrategy(houseCard, playerCard, isPlayerSoft, isPair) {
    print('get basic strategy house: ' + houseCard + ' player: ' + playerCard + ' is soft: ' + isPlayerSoft)
    if (!isPlayerSoft) {
        if (4 <= playerCard && playerCard <= 8) {
            return 'h';
        }
        if (playerCard == 9) {
            if (houseCard != 6)
                return 'h';
            else
                return 'd4';
        }
        if (playerCard == 10) {
            if (houseCard > 8 && houseCard < 12)
                return 'h';
            else if (houseCard > 3 && houseCard < 7)
                return 'd';
            else if (houseCard == 2 || houseCard == 3)
                return 'd5';
            else if (houseCard == 7)
                return 'd4';
            else if (houseCard == 8)
                return 'd3';
        }
        if (playerCard == 11) {
            if (houseCard > 2 && houseCard < 7)
                return 'd5';
            else if (houseCard > 9 && houseCard < 14)
                return 'd3';
            else
                return 'd4';
        }
        if (playerCard == 12) {
            return 'h';
        }
        if (playerCard == 13) {
            return 'h';
        }
        if (playerCard == 14) {
            if (houseCard == 4 || houseCard == 6)
                return 's4*';
            else if (houseCard == 5)
                return 's5*';
            else
                return 'h';
        }
        if (playerCard == 15) {
            if (houseCard == 2)
                return 's4*';
            else if (houseCard == 3)
                return 's5*';
            else if (houseCard == 4)
                return 's5"';
            else if (houseCard == 5)
                return 's6';
            else if (houseCard == 6)
                return 's6"';
            else
                return 'h';
        }
        if (playerCard == 16) {
            if (houseCard == 2)
                return 's5';
            else if (houseCard == 3 || houseCard == 4) {
                return 's6';
            }

            else if (houseCard == 5 || houseCard == 6)
                return 's';
            else
                return 'h';
        }
        if (playerCard == 17) {
            if (houseCard > 7 && houseCard < 14 && houseCard != 11)
                return 's6';
            else if (houseCard == 11) {
                return 'rh';
            } else
                return 's';
        }
        if (playerCard > 17) {
            return 's';
        }
    } else if (isPlayerSoft) {
        if (playerCard > 11 && playerCard < 16) {
            return 'h';
        }
        if (playerCard == 16) {
            if (houseCard == 6)
                return 'd4';
            else
                return 'h'
        }
        if (playerCard == 17) {
            if (houseCard == 4)
                return 'd3';
            else if (houseCard == 5)
                return 'd4';
            else if (houseCard == 6)
                return 'd5';
            else
                return 'h';
        }
        if (playerCard == 18) {
            if (houseCard == 4)
                return 'd4';
            else if (houseCard == 5 || houseCard == 6)
                return 'd5';
            else if (houseCard == 2 || houseCard == 3 || houseCard == 8)
                return 's4';
            else if (houseCard == 7)
                return 's6';
            else
                return 'h';
        }
        if (playerCard > 18 && playerCard < 22) {
            if (houseCard == 10)
                return 's6';
            else
                return 's';
        }
    }

}

function dealerStart() {
    print('*** dealer start a new game ***');
    // first burn the first card
    if (shuffledArray.length == 384) {
        goneArray.push(popCard());
    }
    // dealer draw the first card for himself
    let firstDealer = popCard();
    dealerHand.push(firstDealer);

    // dealer draw a card for every player
    for (let i = 0; i < numberOfPlayers; i++) {
        let playerHand = [];
        playerHand.push(popCard())
        players.push(playerHand);
    }
    // dealer gices the second card to every player
    players.forEach(player => {
        player.push(popCard())
    })
    // dealer gives the last card to himself
    let secondDealer = popCard();
    dealerHand.push(secondDealer);
}
// checks and array of cards if the a hands is not stoped return it's index
function isAllStoped(player) {
    let i = 0;
    for (let n = 0; n < player.length; n++) {
        let p = player[n];
        i++
        print('player i stop checking is:', p);
        if (p.indexOf('stoped') === -1 && p.indexOf('busted') === -1 && p.indexOf('surrender') === -1) {
            print('i is:' + i);
            return i;
        }
    }
    return 0;
}

function popCard() {
    let card = shuffledArray.pop();
    lastCounting.push(card);
    if (lastCounting.length > countingLimit) {
        lastCounting.shift();
    }
    return card;
}
function setBet() {
    // dprint('last counting array: ', lastCounting);
    if (lastCounting.length === countingLimit) {
        // let lastCountingCopy = lastCounting;
        // let totalHigh = lastCountingCopy.filter(k => { return (k.value === 10 || k.value === 11) }).length;
        // let expectedHigh = countingLimit / 3;
        // if (totalHigh > expectedHigh + 10 && totalHigh < expectedHigh + 20)
        //     minBit = 50;
        // else if (totalHigh > expectedHigh + 20) {
        //     minBit = 75;
        //     dprint('bet is 75 ----');
        // }
    }
    //  dprint('bet is: ' + minBit);
}

function playThirdRound() {
    setBet();
    print('*** dealer start to play with each player individually ***');
    let dealerFirstCard = dealerHand[0].value;
    let dealerTotalValue = getTotalValue(dealerHand).total;
    let dealerBlackJack = false;
    if (dealerTotalValue === 21) {
        dealerBlackJack = true;
    }
    for (let n = 0; n < players.length; n++) {
        let player = players[n]

        let playerFirstCard = player[0];
        let playerSecondCard = player[1];
        // we check if player has a pair based on strategy
        let _isPair = isPair(player[0].value, dealerFirstCard);

        if (player[0].value == player[1].value && 'p' == _isPair && dealerBlackJack) {
            print('*** player has a valid pair ***')
            player = [];
            let playerFirstHand = [];
            playerFirstHand.push(playerFirstCard);
            player.push(playerFirstHand);
            let playerSecondHand = [];
            playerSecondHand.push(playerSecondCard);
            player.push(playerSecondHand);

            // if (playerFirstCard.value === shuffledArray[shuffledArray.length - 1].value) {

            playPlayerPairs(player, dealerFirstCard);
            //  }
            players[n] = player;
        } else {
            // let basicStrategy = getBasicStrategy(dealerFirstCard, getTotalValue(player).total, getTotalValue(player).isSoft, _isPair);
            playWithStrategy(dealerFirstCard, player, dealerBlackJack);
            // print('dealer first card: ' + dealerFirstCard + ' basic strategy: ' + basicStrategy + ' player: ' + JSON.stringify(player) + '\n');
        }
    }
    if (!dealerBlackJack)
        dealerPlay(dealerHand);
    let dealerTotal = 0;
    dealerHand.forEach(hand => {
        dealerTotal += hand.value;
    })
    print('dealer Total is: ' + dealerTotal);
    dealerCheckout();
    print('bank account', playersBank);
}

function dealerCheckout() {
    let dealerBusted = dealerHand.indexOf('busted') === -1 ? false : true;
    let dealerTotal = getTotalValue(dealerHand).total;
    let p = 0;
    print('players:', players);

    players.forEach(hand => {
        if (hand[0] instanceof Array && hand.length > 1) {
            hand.forEach(h => {
                calculateWinLoss(h)
            })
        } else {
            calculateWinLoss(hand);
        }
    })
}
function calculateWinLoss(hand) {
    let dealerBusted = dealerHand.indexOf('busted') === -1 ? false : true;
    let playerBusted = hand.indexOf('busted') === -1 ? false : true;
    let dealerTotal = getTotalValue(dealerHand).total;
    let p = 0;
    //  print('players:', players);
    let playerTotal = getTotalValue(hand).total;
    let quantity = 0;
    hand.forEach(card => {
        if (card.value)
            quantity++;
    })
    print('total is: ' + playerTotal + ' hand is: ', hand)
    if (hand.indexOf('surrender') != -1) {
        // console.log('surrendered');
        playersBank.push([-1 * minBit / 2, playerTotal, dealerTotal]);
        return;
    }
    let isDobuled = hand.indexOf('doubled') != -1 ? true : false;
    if (getHandStatus(hand)) {
        if (playerBusted) {
            if (isDobuled) {
                playersBank.push([-2 * minBit, playerTotal, dealerTotal]);
            } else {
                playersBank.push([-1 * minBit, playerTotal, dealerTotal]);
            }
        } else if (playerTotal === 21 && !isDobuled) {
            if (quantity === 2) {
                playersBank.push([minBit * 1.5, playerTotal, dealerTotal]);
            }
            if (quantity == 5 && !dealerBusted) {
                //console.log(quantity + '' + JSON.stringify(hand));
                playersBank.push([minBit * 1.5, playerTotal, dealerTotal]);
            }
            if (quantity == 6 && !dealerBusted) {
                playersBank.push([minBit * 2, playerTotal, dealerTotal]);
            }
            if (quantity > 6 && !dealerBusted) {
                playersBank.push([minBit * 3, playerTotal, dealerTotal]);
            }
            if (quantity === 3 && !dealerBusted) {
                let values = [];
                let kinds = [];
                let suitedSpade = false;
                let suited = false;

                hand.forEach(card => {
                    if (card.value) {
                        values.push(card.value);
                        values.push(card.kind);
                    }

                })
                if (kinds[0] == 3 && kinds[1] == 3 && kinds[2] == 3) {
                    suitedSpade = true;
                } else if (kinds[0] == kinds[1] == kinds[2]) {
                    suited = true;
                }
                if (values.indexOf(6) != -1 && values.indexOf(7) != -1) {
                    //  console.log('678 -- ' + JSON.stringify(hand));
                    if (!suited) {
                        playersBank.push([minBit * 1.5, playerTotal, dealerTotal]);
                    } else if (suited) {
                        playersBank.push([minBit * 2, playerTotal, dealerTotal]);
                    } else if (suitedSpade)
                        playersBank.push([minBit * 3, playerTotal, dealerTotal]);
                }
                if (values.filter(k => { return k == 7 }).length === 3) {
                    // console.log('777 -- ' + JSON.stringify(hand) + ' dealer hand: '+dealerHand[0].value);
                    if (!suited) {
                        if (dealerHand[0].value == 7) {
                            // console.log('777 -- ' + JSON.stringify(hand) + '' + dealerHand[0].value);
                            // playersBank.push([minBit + 5000, playerTotal, dealerTotal]);
                        } else
                            playersBank.push([minBit * 1.5, playerTotal, dealerTotal]);
                    } else if (suited) {
                        if (dealerHand[0].value == 7) {
                            console.log('777 -- ' + JSON.stringify(hand) + '' + dealerHand[0].value);
                            playersBank.push([minBit + 5000, playerTotal, dealerTotal]);
                        } else
                            playersBank.push([minBit * 2, playerTotal, dealerTotal]);
                    } else if (suitedSpade)
                        if (dealerHand[0].value == 7) {
                            console.log('777 -- ' + JSON.stringify(hand) + '' + dealerHand[0].value);
                            playersBank.push([minBit + 5000, playerTotal, dealerTotal]);
                        } else
                            playersBank.push([minBit * 3, playerTotal, dealerTotal]);
                }
            }

        }  else if (!isDobuled) {
            if (dealerBusted) {
                playersBank.push([minBit * 1, playerTotal, dealerTotal]);
            } else if (playerTotal === dealerTotal && !dealerBusted) {
                playersBank.push([0, playerTotal, dealerTotal]);
            } else if (playerTotal > dealerTotal && !dealerBusted) {
                playersBank.push([minBit * 1, playerTotal, dealerTotal]);
            } else {
                playersBank.push([-1 * minBit, playerTotal, dealerTotal]);
            }
        } else if (isDobuled) {
            if (dealerBusted) {
                playersBank.push([minBit * 2, playerTotal, dealerTotal]);
            } else if (playerTotal === dealerTotal && !dealerBusted) {
                playersBank.push([0, playerTotal, dealerTotal]);
            } else if (playerTotal > dealerTotal && !dealerBusted) {
                playersBank.push([minBit * 2, playerTotal, dealerTotal]);
            } else {
                playersBank.push([-2 * minBit, playerTotal, dealerTotal]);
            }
        } else {
            dprint('whatttttttttt???');
        }
    }

    let dealerFirstValue = dealerHand[0].number;
    let dealerFirstKind = dealerHand[0].kind;
    let playerFirstValue = hand[0].number;
    let playerFirstKind = hand[0].kind;
    let playerSecondtValue = hand[1].number;
    let playerSecondKind = hand[1].kind;
    if (dealerFirstValue == playerFirstValue && dealerFirstValue == playerSecondtValue) {
        if (dealerFirstKind == playerFirstKind && dealerFirstKind == playerSecondKind) {
            playerBankMatches.push([matchBet * 24, playerTotal, dealerTotal]);
            //dprint('2444444444');
        }
        if (dealerFirstKind == playerFirstKind && dealerFirstKind != playerSecondKind) {
            playerBankMatches.push([matchBet * 15, playerTotal, dealerTotal]);
        }
        if (dealerFirstKind != playerFirstKind && dealerFirstKind == playerSecondKind) {
            playerBankMatches.push([matchBet * 15, playerTotal, dealerTotal]);
        }
        if (dealerFirstKind != playerFirstKind && dealerFirstKind != playerSecondKind) {
            playerBankMatches.push([matchBet * 6, playerTotal, dealerTotal]);
        }
    }
    else if (dealerFirstValue == playerFirstValue && dealerFirstValue != playerSecondtValue) {
        if (dealerFirstKind == playerFirstKind) {
            playerBankMatches.push([matchBet * 12, playerTotal, dealerTotal]);
        }
        if (dealerFirstKind != playerFirstKind) {
            playerBankMatches.push([matchBet * 3, playerTotal, dealerTotal]);
        }
    }
    else if (dealerFirstValue != playerFirstValue && dealerFirstValue == playerSecondtValue) {
        if (dealerFirstKind == playerSecondKind) {
            playerBankMatches.push([matchBet * 12, playerTotal, dealerTotal]);
        }
        if (dealerFirstKind != playerSecondKind) {
            playerBankMatches.push([matchBet * 3, playerTotal, dealerTotal]);
        }
    } else {
        playerBankMatches.push([-matchBet, playerTotal, dealerTotal]);
    }
    //  dprint('player hand', hand);
    //  dprint('dealer hand', dealerHand);
    //  dprint('win ', playersBank[playersBank.length-1]);
    // dprint('bank match', playerBankMatches);
}

function dealerPlay(dealerHand) {
    print('$$$$$$$ Dealer plays for himself');
    let total = getTotalValue(dealerHand).total;
    print('dealer hand rec: ' + JSON.stringify(dealerHand) + '\n');

    if (total < 17) {
        print('dealer total less than 17 \n')
        dealerHand.push(popCard());
    } else if (total > 21) {
        dealerHand.push('busted');
        return;
    } else {
        return;
    }

    dealerPlay(dealerHand);
}

function playPlayerPairs(player, dealerFirstCard) {
    print('player pair hands:', player);
    let k = isAllStoped(player);
    print('k is: ' + k)
    if (k == 0) {
        return;
    }
    let playerThirdHand = [];
    if (player[k - 1][0].value === shuffledArray[shuffledArray.length - 1].value) {
        print('pair again', player[k - 1][0].value)
        let thirdCard = popCard();
        playerThirdHand.push(thirdCard);
        player.push(playerThirdHand)
    } else {
        print(' play with strategy for the player pairs ************ \n');
        player[k - 1].push(popCard());
        print('pair hand: ' + JSON.stringify(player[k - 1]));
        playWithStrategy(dealerFirstCard, player[k - 1], false)
    }
    playPlayerPairs(player, dealerFirstCard);

}

function getHandStatus(playerCards) {
    let stoped = playerCards.indexOf('stoped') === -1 ? false : true;
    let busted = playerCards.indexOf('busted') === -1 ? false : true;
    let surrender = playerCards.indexOf('surrender') === -1 ? false : true;
    if (stoped || busted || surrender) {
        if (stoped)
            print('*** player stops ***');
        if (busted)
            print('*** player busted ***');
        if (surrender)
            print('*** player surrendered ***');

        print(' ############### ')
        return true;
    } else
        return false;
}

function getHandStatus2(playerCards) {
    let stoped = playerCards.indexOf('stoped') === -1 ? false : true;
    let doubled = playerCards.indexOf('doubled') === -1 ? false : true;
    let busted = playerCards.indexOf('busted') === -1 ? false : true;
    let surrender = playerCards.indexOf('surrender') === -1 ? false : true;
    if (stoped || busted || surrender || doubled) {
        if (stoped)
            print('*** player stops ***');
        if (busted)
            print('*** player busted ***');
        if (surrender)
            print('*** player surrendered ***');

        print(' ############### ')
        return true;
    } else
        return false;
}

function playWithStrategy(dealerCard, playerCards, dealerBlackJack) {
    print('play with strategy ************');
    print(JSON.stringify(playerCards) + '----------- ' + JSON.stringify(playerCards[playerCards.length - 1]) + 'pcs  \n');
    if (getHandStatus(playerCards)) {
        return;
    }
    if (dealerBlackJack) {
        let playerTotal = getTotalValue(playerCards).total;
        if (playerTotal === 21) {
            playerCards.push('stoped');
            return;
        }
    }
    let strategy = getBasicStrategy(dealerCard, getTotalValue(playerCards).total, getTotalValue(playerCards).isSoft, false)
    if (playerCards.length == 2 && playerCards[0].value == 7 && playerCards[1].value == 7 && playerCards[0].kind == playerCards[1].kind && dealerCard == 7) {
        strategy = 'h';
    }
    print('dealer first card: ' + dealerCard + ' basic strategy: ' + strategy + ' player: ' + JSON.stringify(playerCards) + '\n');
    if (strategy == undefined) {
        console.log(dealerCard + '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% undefined strategy %%%%%%%%%%%%%%%%%%%%%%%%%%%%%' + JSON.stringify(playerCards));

        return;
    }

    switch (strategy) {
        case 'h':
            play2(playerCards, false);
            break;
        case 's': {
            print('inserting stop');
            playerCards.push('stoped');
        }
            break;
        case 's4': {
            if (playerCards.length >= 4)
                play2(playerCards, false);
            else
                playerCards.push('stoped');
        }
            break;
        case 's5': {
            if (playerCards.length >= 5)
                play2(playerCards, false);
            else
                playerCards.push('stoped');
        }
            break;
        case 's6': {
            if (playerCards.length >= 6) {
                play2(playerCards, false);
            } else {
                playerCards.push('stoped');
            }
        }
            break;
        case 'd':
            play2(playerCards, true);
            break;
        case 'd3': {
            if (playerCards.length >= 3) {
                play2(playerCards, false)
            } else {
                play2(playerCards, true);
            }
        }
            break;
        case 'd4': {
            if (playerCards.length >= 4) {
                play2(playerCards, false)
            } else {
                play2(playerCards, true);
            }
        }
            break;
        case 'd5': {
            if (playerCards.length >= 5) {
                play2(playerCards, false)
            } else {
                play2(playerCards, true);
            }
        }
            break;
        case 'rh':
            playerCards.push('surrender');
            break;
        case 's4*': {
            if (playerCards.length >= 4) {
                play2(playerCards, false);
                break;
            }
            if (playerCards.length < 4) {
                if (playerCards.length == 2) {
                    let firstCard = playerCards[0].value
                    if (firstCard == 6 || firstCard == 7 || firstCard == 8) {
                        let secondCard = playerCards[1].value
                        if (secondCard != firstCard && (secondCard == 6 || secondCard == 7 || secondCard == 8)) {
                            play2(playerCards, false);
                            break;
                        }
                    }
                }
                playerCards.push('stoped');
            }
        }
            break;
        case 's5*': {
            if (playerCards.length >= 5) {
                play2(playerCards, false);
                break;
            }
            if (playerCards.length < 5) {
                if (playerCards.length == 2) {
                    let firstCard = playerCards[0].value
                    if (firstCard == 6 || firstCard == 7 || firstCard == 8) {
                        let secondCard = playerCards[1].value
                        if (secondCard != firstCard && (secondCard == 6 || secondCard == 7 || secondCard == 8)) {
                            play2(playerCards, false);
                            break;
                        }
                    }
                }
                playerCards.push('stoped');
            }
        }
            break;
        case 's5"': {
            if (playerCards.length >= 5) {
                play2(playerCards, false);
                break;
            }
            if (playerCards.length < 5) {
                if (playerCards.length == 2) {
                    let firstCard = playerCards[0].value
                    if (firstCard == 6 || firstCard == 7 || firstCard == 8 && playerCards[0].kind == 3) {
                        let secondCard = playerCards[1].value
                        if (playerCards[1].kind == 3 && secondCard != firstCard && (secondCard == 6 || secondCard == 7 || secondCard == 8)) {
                            play2(playerCards, false);
                            break;
                        }
                    }
                }
                playerCards.push('stoped');
            }

        }
            break;
        case 's6"': {
            if (playerCards.length >= 6) {
                play2(playerCards, false);
                break;
            }
            if (playerCards.length < 6) {
                if (playerCards.length == 2) {
                    let firstCard = playerCards[0].value
                    if (firstCard == 6 || firstCard == 7 || firstCard == 8 && playerCards[0].kind == 3) {
                        let secondCard = playerCards[1].value
                        if (playerCards[1].kind == 3 && secondCard != firstCard && (secondCard == 6 || secondCard == 7 || secondCard == 8)) {
                            play2(playerCards, false);
                            break;
                        }
                    }
                }
                playerCards.push('stoped');
            }

        }
            break;
        default:
            //playerCards.push('stoped');
            break;
    }
    playWithStrategy(dealerCard, playerCards, dealerBlackJack);
}

function play2(playerCards, isDouble) {
    if (!isDouble && playerCards[playerCards.length - 1] != 'stoped') {
        playerCards.push(popCard());
        if (getTotalValue(playerCards).total > 21) {
            playerCards.push('busted');
            // addInfo(playerCards, 'busted');
        }
        //  playerCards.push('stoped');
    } else
        if (isDouble && playerCards[playerCards.length - 1] != 'stoped') {
            playerCards.push(popCard());
            playerCards.push('stoped');
            playerCards.push('doubled');
            // addInfo(playerCards, 'stoped');
        }
}
function addInfo(hand, status?, isDoubled?, isSurrendered?, bet?) {
    let info = {};
    if (hand.info) {
        let info = hand.info;
        info.status = status || info.hand;
        info.isDoubled = isDoubled || info.isDoubled;
        info.isSurrendered = isSurrendered || info.isSurrendered;
        info.bet = bet || info.bet;
    } else {
        let info = { 'info': {} };
        if (status)
            info['info']['status'] = status;
        if (isDoubled)
            info['info']['isDoubled'] = isDoubled
        if (isSurrendered)
            info['info']['isSurrendered'] = isSurrendered
        if (bet)
            info['info']['bet'] = bet
        hand.push(info);
    }
    playedHand.push({ 'info': info, 'hand': hand });
    print('hand after infooooooo is:', hand);
}

function getTotalValue(cardsArray) {
    let total = 0;
    let isFirstAce = false;
    let isSoft = false;
    cardsArray.forEach(hand => {
        if (hand && hand.number && !isFirstAce && hand.number === 1 && total <= 10) {
            isSoft = true;
            total += hand.value;
            isFirstAce = true;
        }
        else if (hand && hand.number) {
            total += hand.number === 1 ? 1 : hand.value;
        }
    })
    if (isSoft && total > 21) {
        return { 'total': total - 10, 'isSoft': false };
    } else if (isSoft && total < 21) {
        return { 'total': total, 'isSoft': true };
    } else
        return { 'total': total, 'isSoft': false };
}

function print(msg, logObj?) {

    // if (logObj === undefined) {
    //     console.log('>> ' + msg + '\n');
    // } else
    //     console.log('>> ' + msg + ' --  ' + JSON.stringify(logObj) + '\n');
}

function dprint(msg, logObj?) {

    if (logObj === undefined) {
        console.log('>> ' + msg + '\n');
    } else
        console.log('>> ' + msg + ' --  ' + JSON.stringify(logObj) + '\n');
}

function totoalLose() {
    let t = 0;
    let tf = 0
    let i = 0;
    playersBank.forEach(p => {
        blackjackFalctuation.push(t += p[0]);
        totalFlactuation.push(tf += (p[0] + playerBankMatches[i][0]));
        i++;
    })
    //dprint('blackjack flactuation', blackjackFalctuation);
    return t;
}
function totoalLoseOmMatches() {
    let t = 0;
    playerBankMatches.forEach(p => {
        sideBetFalctuation.push(t += p[0]);
    })
    // dprint('side bet flactuation', sideBetFalctuation);
    return t;
}
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

function runGame() {
    // print(sortedArray.length + '---' + shuffledArray.length);
    // generateCards();
    // print(sortedArray.length + '-----' + JSON.stringify(sortedArray));
    shuffle();
    lastCounting = [];
    // print(shuffledArray.length + '-----' + JSON.stringify(shuffledArray));
    for (let n = 0; n < 100000; n++) {
        if (shuffledArray.length < 40) {
            shuffle();
        }
        //  print('*********************');
        playerHand = [];
        hands = [];
        players = [];
        dealerHand = [];
        dealerStart();
        playThirdRound();
    }

    dprint('total blackjack: ' + totoalLose() + ' total matches: ' + totoalLoseOmMatches() +
        '\n blackjack max: ' + getMaxOfArray(blackjackFalctuation) +
        ' min : ' + getMinOfArray(blackjackFalctuation) + '\n matching max: '
        + getMaxOfArray(sideBetFalctuation) + ' min: ' + getMinOfArray(sideBetFalctuation)
        + '\n total max: '
        + getMaxOfArray(totalFlactuation) + ' min: ' + getMinOfArray(totalFlactuation));
}
print('------------------------------------------------');

runGame();



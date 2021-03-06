import { Injectable } from '@angular/core';
import { TranslationService } from './translation.service';
import { Transaction } from '../metrix/classes';
import Helpers from '../helpers';

import { CurrencyService } from 'app/providers/currency.service';

@Injectable()
export class DesktopNotificationService {

    constructor(
        private translation: TranslationService,
        public currencyService: CurrencyService
    ) {
    }

    public async notifyNewTransaction(trx: Transaction) {
        // get title
        let title = 'Metrix - ';
        if (trx.category === "Received")
            title += await this.translation.translate('DESKTOPNOTIFICATIONS.NEWTRANSACTION_TITLE_RECEIVED');
        if (trx.category === "Generated" && trx.subCategory === "Minted")
            title += await this.translation.translate('DESKTOPNOTIFICATIONS.NEWTRANSACTION_TITLE_STAKE');
        if (trx.category === "Generated" && trx.subCategory === "Masternode Reward")
            title += await this.translation.translate('DESKTOPNOTIFICATIONS.NEWTRANSACTION_TITLE_MASTERNODE');

        // get body
        let eplased = Helpers.friendlyTimeEplased(trx.timestamp);
        let eplasedBody = '';
        if (eplased[0]) eplasedBody = `${eplased[0]} `;
        eplasedBody += await this.translation.translate(eplased[1]);
        eplasedBody += ' ' + await this.translation.translate('MISC.AGO');
        let body = `${this.currencyService.displayLocal(trx.amount)} (${eplasedBody})`;

        // show
        this.notify(title, body, true, false);
    }

    public async notify(title: string, body: string, translateTitle: boolean = true, translateBody: boolean = true): Promise<void> {
        if (translateTitle) title = await this.translation.translate(title)
        if (translateBody) body = await this.translation.translate(body)
        new Notification(title, { body })
    }


}
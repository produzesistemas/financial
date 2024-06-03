import { AccountType } from 'src/app/_model/account-type-model';
export class AccountPlan {
    id: number | undefined;
    description: string | undefined;
    classification: string | undefined;
    reducedAccount: number | undefined;
    active: boolean | undefined;
    accountTypeId: number | undefined;
    createdBy: string | undefined;
    changedBy: string | undefined;
    createDate: Date | undefined;
    updateDate: Date | undefined;

    accountType: AccountType = new AccountType();

    public constructor(init?: Partial<AccountPlan>) {
        Object.assign(this, init);
    }

    static fromJson(jsonData: any): AccountPlan {
        return Object.assign(new AccountPlan(), jsonData);
    }
}

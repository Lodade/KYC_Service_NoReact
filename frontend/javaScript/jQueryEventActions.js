async function onResultsShow() {
    $("#dividendsExpandButton").click(async () => {
        $(".dividends").toggleClass("hiddenDividends");
    });
    $("#accountsNIExpandButton").click(async () => {
        $(".NIAccounts").toggleClass("hiddenNIAccounts");
    });
    $("#accountsCNExpandButton").click(async () => {
        $(".CNAccounts").toggleClass("hiddenCNAccounts");
    });
    $("#eligibleTransactionsExpandButton").click(async () => {
        $(".transactions").toggleClass("hiddenTransactions");
    });
    $("#eligibleProvincesExpandButton").click(async () => {
        $(".provinces").toggleClass("hiddenProvinces");
    });
    $("#minimumsExpandButton").click(async () => {
        $(".minimums").toggleClass("hiddenMinimums");
    });
}
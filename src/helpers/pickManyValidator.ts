export function pickManyValidator(formItem) {
    const val = formItem.value;
    return (val && val.length > 0) ? null : { msg: "Pick many question is required"};
}
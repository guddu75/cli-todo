const { Input } = require('enquirer');
const shouldCancel = require('cli-should-cancel');
const handleError = require('cli-handle-error');
const to = require('await-to-js').default;


module.exports = async ({message}) => {

    const [err,response] = await to(
        new Input({
            message,
            validate(value){
                return !value ? `Please add a value` : true;
            }
        })
        .on(`cancel` , () => shouldCancel())
        .run()
    );
    handleError(`INPUT: `,err);
    return response;
}
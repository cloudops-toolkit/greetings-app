exports.handler = async function(event: any) {
    console.log('Received event:', JSON.stringify(event, null, 2));
  
    event.Records.forEach((record: any) => {
      const message = record.Sns ? record.Sns.Message : record.body;
      console.log('Gibberish text:', message);
    });
  };
  
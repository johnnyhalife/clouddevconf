require './keys.rb'
require 'json'
require 'waz-storage'
require 'waz-queues'
require 'clockwork'

include Clockwork

WAZ::Storage::Base.establish_connection!(:account_name => STORAGE_ACCOUNT, :access_key => STORAGE_KEY)
queue = WAZ::Queues::Queue.find('clouddevconf')
queue ||= WAZ::Queues::Queue.create('clouddevconf')

every(5.seconds, 'Get message from queue') do 
	messages = queue.lock(32)

	(messages || []).each do |message|
		begin
			puts JSON.parse(Base64.decode64(message.message_text))
		rescue
			# swallow
		ensure 
			message.destroy!		
		end
	end
end
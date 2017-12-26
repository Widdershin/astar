class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise *[
    :database_authenticatable,
    (:registerable unless Rails.env.prod?),
    :recoverable,
    :rememberable,
    :trackable,
    :validatable
  ].compact

  has_many :projects
end
